import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen, within } from '@testing-library/angular';
import { of } from 'rxjs';
import { OrderListComponent } from './order-list.component';
import { Order } from './order.model';
import { OrderService } from './order.service';


registerLocaleData(localePt, 'pt');

describe('OrderListComponent', () => {
  let fixture: ComponentFixture<OrderListComponent>;
  const orderServiceStub = jasmine.createSpyObj('OrderService', ['getByCreation']);
  
  const ORDER_TEST_ID = "order";
  
  const ORDER_OF_JOAO: Order = {
    customerName: "João",
    value: 68.70,
    deliveryTax: 4.00,
    isPaid: false,
    total: 72.70
  };

  const PAID_ORDER: Partial<Order> = {
    isPaid : true
  };

  const ORDER_LIST: Order[] = [
    ORDER_OF_JOAO,
    ORDER_OF_JOAO,
    ORDER_OF_JOAO
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
        { provide: OrderService, useValue: orderServiceStub}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    fixture.detectChanges();
  });

  it('should show order list', () => {
    orderServiceStub.getByCreation.and.returnValue(of(ORDER_LIST));
   
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    expect(screen.getAllByTestId(ORDER_TEST_ID)).toHaveSize(ORDER_LIST.length);
  });

  it('should show order info', async () => {
    orderServiceStub.getByCreation.and.returnValue(of([ORDER_OF_JOAO]));
    
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const actual = within(screen.getByTestId(ORDER_TEST_ID));

    expect(actual.getByText("João")).toBeDefined();
    expect(actual.getByText("valor: R$ 68,70")).toBeDefined();
    expect(actual.getByText("Não pago")).toBeDefined();
    expect(actual.getByText("entrega: R$ 4,00")).toBeDefined();
    expect(actual.getByText("total: R$ 72,70")).toBeDefined();
  });

  it('should show pago when order is paid',() => {
    orderServiceStub.getByCreation.and.returnValue(of([PAID_ORDER]));
    
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const actual = within(screen.getByTestId(ORDER_TEST_ID));

    expect(actual.getByText("Pago")).toBeDefined();
  });
});
