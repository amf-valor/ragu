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

describe('OrderDetailComponent', () => {
  let fixture: ComponentFixture<OrderDetailComponent>;
  let httpTestingControllerHelper: HttpTestingControllerHelper;
  let messageService: MessageService;

  const ORDER_OF_JOAO_ID = '1';
  const JOAO_ORDER_DETAIL_URI = `${environment.raguBaseUrl}/api/orders/${ORDER_OF_JOAO_ID}`;
  
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
              'id': ORDER_OF_JOAO_ID
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
    httpTestingControllerHelper.expectOneAndFlush(JOAO_ORDER_DETAIL_URI, Mother.orderDetailsOfJoao());
    fixture.detectChanges();

    const productElement = within(screen.getByTestId('product'));
    
    expect(screen.getByText(element => element.endsWith('01 de maio, 01:00 PM'))).toBeDefined();
    expect(screen.getByText('João')).toBeDefined();
    expect(screen.getByText('(12) 98625-4104')).toBeDefined();
    expect(screen.getByText('Rua maracatu, 383 CENTRO - São Paulo'));
    expect(productElement.getByText('ragu')).toBeDefined();
    expect(productElement.getByText(/R\$ 10,00/i));
  });

  it('should add error message to message service when getOrderDetails fail', () => {
    let actual: Message = {};
    messageService.messageObserver.subscribe(message => actual = message as Message);
    
    httpTestingControllerHelper
      .expectFirstStartsWithAndFlush(JOAO_ORDER_DETAIL_URI, Mother.internalServerError());
    
    expect(actual).toEqual(Mother.errorMessage());
  });
});
