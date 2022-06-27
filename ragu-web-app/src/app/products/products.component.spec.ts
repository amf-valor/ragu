import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { fireEvent, screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { givenInputExpectOnlyNumbersAndCurrencyFormat, HttpTestingControllerHelper, Page } from 'src/testing';
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

describe('ProductsComponent', () => {
  let fixture: ComponentFixture<ProductsComponent>;
  let page: ProductsPage;
  let httpTestingController: HttpTestingController;
  let httpTestingControllerHelper: HttpTestingControllerHelper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [
        ButtonModule,
        InputNumberModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        CardModule
      ],
      providers:[MessageService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingControllerHelper = new HttpTestingControllerHelper(httpTestingController);
    page = new ProductsPage(fixture);
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
    await userEvent.type(page.nameInput, 'ragu');
    fireEvent.change(page.priceInput, { target: { value: "20" } });
    fireEvent.blur(page.priceInput);
    fixture.detectChanges();
    await userEvent.click(page.saveButton);
    
    const actual = httpTestingController.expectOne(PRODUCTS_RESOURCE).request;

    expect(actual.method).toBe('POST');
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
    await userEvent.type(page.nameInput, 'ragu');
    page.typeAndLeavePriceInput("20");
    await userEvent.click(page.saveButton);
    httpTestingControllerHelper.matchAndFlushEmpty(PRODUCTS_RESOURCE);
    fixture.detectChanges();

    const actual = page.productFormElements;

    expectProductFormInitialState(actual);
  });

  it('should show error message when save button is clicked and something unexpected occured', async() => {
    const notifyErrorSpy = spyOn(TestBed.inject(NotificationService), 'notifyError');
    await page.fillFormAndSave('ragu', "20");
    
    httpTestingControllerHelper.matchAndFlushInternalServerError(PRODUCTS_RESOURCE);
  
    expect(notifyErrorSpy).toHaveBeenCalledOnceWith();
  });

  function expectProductFormInitialState(elements: ProductFormElements) {
    expect(elements.nameInput.value).toBe('');
    expect(elements.priceInput.value).toBe('');
    expect(elements.saveButton.disabled).toBeTrue();
  }
});



