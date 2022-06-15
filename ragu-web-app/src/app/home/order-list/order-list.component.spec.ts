import { registerLocaleData, Location } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { of } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { Mother } from 'src/testing/mother';
import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order-ragu.service';

registerLocaleData(localePt, 'pt');

describe('OrderListComponent', () => {
  let fixture: ComponentFixture<OrderListComponent>;
  let orderServiceStub: jasmine.SpyObj<OrderService>;

  const ORDER_TEST_ID = "order";

  beforeEach(async () => {
    orderServiceStub = jasmine.createSpyObj('OrderService', ['getBookedOfWholeDay']);
    orderServiceStub.getBookedOfWholeDay.and.returnValue(of(Mother.ordersOfJoaoJoanaAndMarcelo()));

    await TestBed.configureTestingModule({
      declarations: [OrderListComponent],
      providers: [
        { provide: LOCALE_ID, useValue: 'pt' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
        { provide: OrderService, useValue: orderServiceStub }
      ],
      imports: [
        DataViewModule,
        CalendarModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(Mother.mayFirst());
    fixture = TestBed.createComponent(OrderListComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should show order list', () => {
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    expect(screen.getAllByTestId(ORDER_TEST_ID)).toHaveSize(Mother.ordersOfJoaoJoanaAndMarcelo().length);
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

  it('should show pago when order is paid', () => {
    orderServiceStub.getBookedOfWholeDay.and.returnValue(of([Mother.orderOfJoana()]));
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();

    const actual = within(screen.getByTestId(ORDER_TEST_ID));

    expect(actual.getByText("Pago")).toBeDefined();
  });

  it('should show ordered by bookedAt', async () => {
    const actual = screen.getAllByTestId(ORDER_TEST_ID);
    expectOrderedByTime(actual);
  });

  function expectOrderedByTime(orderElements: HTMLElement[]) {
    expect(within(orderElements[0]).queryByText('11:00')).withContext('11:00 should be first').not.toBeNull();
    expect(within(orderElements[1]).queryByText('12:00')).withContext('12:00 should be second').not.toBeNull();
    expect(within(orderElements[2]).queryByText('12:30')).withContext('12:30 should be third').not.toBeNull();
  }

  it('should show ordered by bookedAt after May 10 is selected on calendar', () => {
    const mayTenthSpan = within(screen.getByTestId('order-calendar')).getByText('10');
    mayTenthSpan.click();
    fixture.detectChanges();

    const actual = screen.getAllByTestId(ORDER_TEST_ID);
    const mayTenth = new Date(2022, 4, 10);

    expect(orderServiceStub.getBookedOfWholeDay).toHaveBeenCalledWith(mayTenth);
    expectOrderedByTime(actual);
  });

  it('should redirect to order of joao details when is clicked', fakeAsync(() => {
    const orderOfJoaoElement = screen.getAllByTestId(ORDER_TEST_ID)[2];
    
    const location = TestBed.inject(Location);
    userEvent.click(orderOfJoaoElement);
    tick();

    expect(location.path()).toBe(`/order-details/${Mother.orderOfJoao().id}`);
  }));
});

