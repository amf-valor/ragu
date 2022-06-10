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
  const orderServiceStub = jasmine.createSpyObj('OrderService', ['getBookedOfWholeDay']);
  
  const ORDER_TEST_ID = "order";

  const ORDER_LIST: Order[] = [
    Mother.orderOfJoao(),
    Mother.orderOfJoao(),
    Mother.orderOfJoao()
  ];

  beforeEach(async () => {
    orderServiceStub.getBookedOfWholeDay.and.returnValue(of(ORDER_LIST));

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
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    
    expect(screen.getAllByTestId(ORDER_TEST_ID)).toHaveSize(ORDER_LIST.length);
  });

  it('should show order info', async () => {
    orderServiceStub.getBookedOfWholeDay.and.returnValue(of([Mother.orderOfJoao()]));
    
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const actual = within(screen.getByTestId(ORDER_TEST_ID));

    expect(actual.getByText("João")).toBeDefined();
    expect(actual.getByText(/R\$ 68,70/i)).toBeDefined();
    expect(actual.getByText("Não pago")).toBeDefined();
    expect(actual.getByText(/R\$ 4,00/i)).toBeDefined();
    expect(actual.getByText(/R\$ 72,70/i)).toBeDefined();
    expect(actual.getByText(/12:30/i)).toBeDefined();
  });

  it('should show pago when order is paid',() => {
    const paidOrder: Partial<Order> = {
      isPaid : true
    };

    orderServiceStub.getBookedOfWholeDay.and.returnValue(of([paidOrder]));
    
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const actual = within(screen.getByTestId(ORDER_TEST_ID));

    expect(actual.getByText("Pago")).toBeDefined();
  });

  it('should show ordered by booking time', async () => {
    const unorderedOrders: Partial<Order>[] = [
      { bookingTime: "12:30" },
      { bookingTime: "11:00" },
      { bookingTime: "12:00" }
    ]; 

    orderServiceStub.getBookedOfWholeDay.and.returnValue(of(unorderedOrders));

    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    const actual = screen.getAllByTestId(ORDER_TEST_ID);

    expect(within(actual[0]).queryByText('11:00')).withContext('11:00 should be first').not.toBeNull();
    expect(within(actual[1]).queryByText('12:00')).withContext('12:00 should be second').not.toBeNull();
    expect(within(actual[2]).queryByText('12:30')).withContext('12:30 should be third').not.toBeNull();
  });
});
