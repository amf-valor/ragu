import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { screen, within } from '@testing-library/angular';
import { Message, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { environment } from 'src/environments/environment';
import { HttpTestingControllerHelper, Mother } from 'src/testing';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailComponent } from './order-detail.component';

describe('OrderDetailComponent', () => {
  let fixture: ComponentFixture<OrderDetailComponent>;
  let httpTestingControllerHelper: HttpTestingControllerHelper;
  let messageService: MessageService;
  
  const ORDER_ID = '1';
  const ORDER_DETAIL_URI = `${environment.raguBaseUrl}/api/orders/${ORDER_ID}`;
  const PHONE_NUMBER_TEST_ID = 'phoneNumber';
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailComponent ],
      imports: [
        DataViewModule, 
        HttpClientTestingModule,
        RouterTestingModule,
        CardModule,
        SharedModule,
        DividerModule,
        CheckboxModule,
        FormsModule
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt' }, 
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }, 
        { provide: ActivatedRoute, useValue: {
          snapshot:{
            params:{
              'id': ORDER_ID
            }
          }
        }},
        MessageService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    httpTestingControllerHelper = new HttpTestingControllerHelper(TestBed.inject(HttpTestingController));
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should show all details', () =>{
    httpTestingControllerHelper.expectOneAndFlush(ORDER_DETAIL_URI, Mother.orderDetailsOfJoao());
    fixture.detectChanges();

    expect(screen.getByText(element => element.endsWith('01 de maio, 01:00 PM'))).toBeDefined();
    expectCustomer('João', '(12) 98625-4104', 'Rua maracatu, 383 CENTRO - São Paulo');
    expectProduct('ragu', /R\$ 10,00/i);
    expectPaymentDetails(/R\$ 10,00/, /R\$ 6,00/, /R\$ 16,00/);
  });

  function expectCustomer(name:string, phone:string, address: string) {
    const phoneNumberElement = within(screen.getByTestId(PHONE_NUMBER_TEST_ID));
    expect(phoneNumberElement.getByText(phone)).toBeDefined();
    expect(screen.getByText(name)).toBeDefined();
    expect(screen.getByText(address));
  }

  function expectProduct(name: string, price: RegExp) {
    const productElement = within(screen.getByTestId('product'));
    expect(productElement.getByText(name)).toBeDefined();
    expect(productElement.getByText(price));
  }

  function expectPaymentDetails(subtotal: RegExp, deliveryTax: RegExp, total: RegExp) {
    const orderPaymentDetailsElement = within(screen.getByTestId("orderPaymentDetails"));
    expect(orderPaymentDetailsElement.getByText(subtotal)).toBeDefined();
    expect(orderPaymentDetailsElement.getByText(deliveryTax)).toBeDefined();
    expect(orderPaymentDetailsElement.getByText(total)).toBeDefined();
  }

  it('should add error message to message service when getOrderDetails fail', () => {
    let actual: Message = {};
    messageService.messageObserver.subscribe(message => actual = message as Message);
    
    httpTestingControllerHelper
      .expectFirstStartsWithAndFlush(ORDER_DETAIL_URI, Mother.internalServerError());
    
    expect(actual).toEqual(Mother.errorMessage());
  });

  it('should not show phone number when customer does not provide', () => 
  {
    httpTestingControllerHelper.expectOneAndFlush(ORDER_DETAIL_URI, Mother.orderDetailsOfJoana());
    fixture.detectChanges();

    const actual = screen.queryByTestId(PHONE_NUMBER_TEST_ID);

    expect(actual).toBeNull();
  });

  it('should be unchecked when order is not paid', async () => {
    httpTestingControllerHelper.expectOneAndFlush(ORDER_DETAIL_URI, Mother.orderDetailsOfJoao());
    fixture.detectChanges();
    await fixture.whenStable();

    const isPaidCheckBox = screen.getByLabelText('Pago?') as HTMLInputElement;
    fixture.detectChanges();

    expect(isPaidCheckBox.checked).toBeFalse();
  });

  it('should be checked when order is paid', async () => {
    httpTestingControllerHelper.expectOneAndFlush(ORDER_DETAIL_URI, Mother.orderDetailsOfJoana());
    fixture.detectChanges();
    await fixture.whenStable();

    const isPaidCheckBox = screen.getByLabelText('Pago?') as HTMLInputElement;
    fixture.detectChanges();
    
    expect(isPaidCheckBox.checked).toBeTrue();
  });
});

