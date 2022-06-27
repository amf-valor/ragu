import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { fireEvent, screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { InputNumberModule } from 'primeng/inputnumber';
import { givenInputExpectOnlyNumbersAndCurrencyFormat, HttpTestingControllerHelper, Mother, Page } from 'src/testing';
import { NotificationService } from '../services/notification.service';
import { ProductsComponent } from './products.component';


interface ProductFormElements {
  nameInput: HTMLInputElement;
  priceInput: HTMLInputElement;
  saveButton: HTMLButtonElement;
}

class ProductsPage extends Page<ProductsComponent> {
  get productFormElements(): ProductFormElements{
    return{
      nameInput: this.nameInput,
      priceInput: this.priceInput,
      saveButton: this.saveButton
    };
  }
  
  get nameInput(): HTMLInputElement{
    return screen.getByLabelText('Nome');
  }
  
  get saveButton(): HTMLButtonElement{
    return screen.getByRole('button', { name: 'Salvar' });
  }
  
  get priceInput() : HTMLInputElement{
    return screen.getByLabelText('Preço');
  }
  
  async fillFormAndSave(name: string, price: string) {
    await userEvent.type(this.nameInput, name);
    this.typeAndLeavePriceInput(price);
    await userEvent.click(this.saveButton);
  }

  typeAndLeavePriceInput(text: string) {
    this.typeAndLeave(this.priceInput, text);
  }
}

const PRODUCTS_RESOURCE = '/api/products';

const postRequestFn = (request: HttpRequest<unknown>) => 
  request.method === 'POST' && request.url === PRODUCTS_RESOURCE;

  fdescribe('ProductsComponent', () => {
    let fixture: ComponentFixture<ProductsComponent>;
    let page: ProductsPage;
    let httpTestingController: HttpTestingController;
    let httpTestingControllerHelper: HttpTestingControllerHelper;
    let notifyErrorSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [
        ButtonModule,
        InputNumberModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        CardModule,
        DataViewModule
      ],
      providers:[
        MessageService,
        { provide: LOCALE_ID, useValue: 'pt' }, 
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }, 
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingControllerHelper = new HttpTestingControllerHelper(httpTestingController);
    page = new ProductsPage(fixture);
    notifyErrorSpy = spyOn(TestBed.inject(NotificationService), 'notifyError');
    fixture.detectChanges();
  });

  it('should product form be in initial state when component is created', () => {
    const actual = page.productFormElements;
    expectProductFormInitialState(actual);
  });

  it('should accept only numbers and format currency when type product price', async () => {
    await givenInputExpectOnlyNumbersAndCurrencyFormat(page.priceInput);
  });

  it('should post new product when save button is clicked', async () => {
    await page.fillFormAndSave('ragu', '20');

    const actual = httpTestingController.expectOne(postRequestFn).request;

    expect(actual.body).toEqual({name: 'ragu', price: 20.0});
  });

  it('should show name required message when product name is not provided', async () => {
    fireEvent.blur(page.nameInput);
    fixture.detectChanges();

    const actual = screen.getByText('Nome é obrigatório');

    expect(actual).toBeDefined();
  });

  it('should show price required message when product price is not provided', () => {
    fireEvent.blur(page.priceInput);
    fixture.detectChanges();

    const actual = screen.getByText('Preço é obrigatório');

    expect(actual).toBeDefined();
  });

  it('should reset product form to initial state when new product is saved', async () => {
    await page.fillFormAndSave('ragu', '20');
    httpTestingControllerHelper.matchAndFlushEmpty(postRequestFn);
    fixture.detectChanges();

    const actual = page.productFormElements;

    expectProductFormInitialState(actual);
  });

  it('should notify error when post fail', async() => {
    await page.fillFormAndSave('ragu', "20");
    
    httpTestingControllerHelper.matchAndFlushInternalServerError(postRequestFn);
  
    expect(notifyErrorSpy).toHaveBeenCalledOnceWith();
  });

  it('should get products when compenent is created', () => {
    const actual = httpTestingController.expectOne(PRODUCTS_RESOURCE).request;
    expect(actual.method).toBe('GET');
  });

  it('should render products when component is created', () => {
    httpTestingControllerHelper.expectOneAndFlush(PRODUCTS_RESOURCE, Mother.raguAndTapioca());
    fixture.detectChanges();

    const productElements = screen.getAllByTestId('product');
    const firstProductElement = within(productElements[0]);
    const secondProductElement = within(productElements[1]);

    expect(productElements.length).toBe(2);
    expect(firstProductElement.getByText('ragu')).toBeDefined();
    expect(firstProductElement.getByText(/R\$ 10,00/)).toBeDefined();
    expect(secondProductElement.getByText('tapioca')).toBeDefined();
    expect(secondProductElement.getByText(/R\$ 5,00/)).toBeDefined();
  });

  it('should notify error when get fail', () => {
    httpTestingControllerHelper.matchAndFlushInternalServerError(request => 
      request.url === PRODUCTS_RESOURCE && 
      request.method === 'GET');
    
    expect(notifyErrorSpy).toHaveBeenCalledOnceWith();
  });

  function expectProductFormInitialState(elements: ProductFormElements) {
    expect(elements.nameInput.value).toBe('');
    expect(elements.priceInput.value).toBe('');
    expect(elements.saveButton.disabled).toBeTrue();
  }
});



