import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { screen, within } from '@testing-library/angular';
import { Message, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { environment } from 'src/environments/environment';
import { HttpTestingControllerHelper, Mother } from 'src/testing';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailComponent } from './order-detail.component';

fdescribe('OrderDetailComponent', () => {
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
        SharedModule
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

    const productElement = within(screen.getByTestId('product'));
    const phoneNumberElement = within(screen.getByTestId(PHONE_NUMBER_TEST_ID));
    
    expect(screen.getByText(element => element.endsWith('01 de maio, 01:00 PM'))).toBeDefined();
    expect(screen.getByText('João')).toBeDefined();
    expect(phoneNumberElement.getByText('(12) 98625-4104')).toBeDefined();
    expect(screen.getByText('Rua maracatu, 383 CENTRO - São Paulo'));
    expect(productElement.getByText('ragu')).toBeDefined();
    expect(productElement.getByText(/R\$ 10,00/i));
  });

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
});
