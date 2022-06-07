import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen, within } from '@testing-library/angular';
import { of } from 'rxjs';
import { Mother } from 'src/testing/mother';
import { OrderListComponent } from './order-list.component';
import { Order } from './order.model';
import { OrderService } from './order-ragu.service';
import { DataViewModule } from 'primeng/dataview';


registerLocaleData(localePt, 'pt');

describe('OrderListComponent', () => {
  let fixture: ComponentFixture<OrderListComponent>;
  const orderServiceStub = jasmine.createSpyObj('OrderService', ['getByCreation']);
  
  const ORDER_TEST_ID = "order";

  const PAID_ORDER: Partial<Order> = {
    isPaid : true
  };

  const ORDER_LIST: Order[] = [
    Mother.orderOfJoao(),
    Mother.orderOfJoao(),
    Mother.orderOfJoao()
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
        { provide: OrderService, useValue: orderServiceStub}
      ],
      imports: [DataViewModule]
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
    orderServiceStub.getByCreation.and.returnValue(of([Mother.orderOfJoao()]));
    
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const actual = within(screen.getByTestId(ORDER_TEST_ID));

    expect(actual.getByText("João")).toBeDefined();
    expect(actual.getByText(/R\$ 68,70/i)).toBeDefined();
    expect(actual.getByText("Não pago")).toBeDefined();
    expect(actual.getByText(/R\$ 4,00/i)).toBeDefined();
    expect(actual.getByText(/R\$ 72,70/i)).toBeDefined();
  });

  it('should show pago when order is paid',() => {
    orderServiceStub.getByCreation.and.returnValue(of([PAID_ORDER]));
    
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const actual = within(screen.getByTestId(ORDER_TEST_ID));

    expect(actual.getByText("Pago")).toBeDefined();
  });
});
