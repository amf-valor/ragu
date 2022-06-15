import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { screen, within } from '@testing-library/angular';
import { Message, MessageService } from 'primeng/api';
import { DataViewModule } from 'primeng/dataview';
import { environment } from 'src/environments/environment';
import { HttpTestingControllerHelper, Mother } from 'src/testing';
import { OrderDetailComponent } from './order-detail.component';

describe('OrderDetailComponent', () => {
  let fixture: ComponentFixture<OrderDetailComponent>;
  let httpTestingControllerHelper: HttpTestingControllerHelper;
  let messageService: MessageService;

  const JOAO_ORDER_DETAIL_URI = `${environment.raguBaseUrl}/api/orders/1`;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailComponent ],
      imports: [
        DataViewModule, 
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt' }, 
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }, 
        { provide: ActivatedRoute, useValue: {
          snapshot:{
            params:{
              'id': '1'
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

  it('should show product', () =>{
    httpTestingControllerHelper.expectOneAndFlush(JOAO_ORDER_DETAIL_URI, Mother.orderDetailsOfJoao());
    fixture.detectChanges();

    const productElement = within(screen.getByTestId('product'));
    
    expect(productElement.getByText('ragu')).toBeDefined();
    expect(productElement.getByText(/R\$ 10,00/i));
  });

  it('should add error message to message service when getOrderDetails fail', () => {
    let actual: Message = {};
    messageService.messageObserver.subscribe(message => actual = message as Message);
    
    httpTestingControllerHelper.expectFirstStartsWithAndFlush(JOAO_ORDER_DETAIL_URI, Mother.internalServerError());
    
    expect(actual).toEqual(Mother.errorMessage());
  });
});
