import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OrderService } from './services/order-ragu.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { MessageService } from 'primeng/api';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerRaguService } from './services/customer-ragu.service';
import { CustomersModule } from './customers/customers.module';

describe('AppRouting', () => {
  let appFixture: ComponentFixture<AppComponent>;
  let router: Router; 

  @Component({selector: 'ragu-menu', template: ''})
  class MenuDummyComponent{}

  @Component({selector: 'p-toast', template: ''})
  class ToastDummyComponent{}

  @Component({selector: 'ragu-order-list', template: ''})
  class OrderListDummyComponent{}

  beforeEach(async () => {
    const orderServiceStub: jasmine.SpyObj<OrderService> = jasmine.createSpyObj('OrderService', ['getOrderDetails']);
    orderServiceStub.getOrderDetails.and.returnValue(of());

    await TestBed.configureTestingModule({
      declarations: [ 
        AppComponent, 
        HomeComponent, 
        MenuDummyComponent, 
        ToastDummyComponent,
        OrderListDummyComponent
      ],
      imports: [RouterTestingModule.withRoutes(routes), OrderDetailModule, CustomersModule],
      providers:[
        { provide:OrderService, useValue: orderServiceStub }, 
        MessageService,
        { provide: CustomerRaguService, useValue: { get: () => of([]) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    appFixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
  });

  it('should redirect to home when initial navigation', fakeAsync(() => {
    router.initialNavigation();
    tick();

    const homeComponent = appFixture.queryOnDebugElement(By.directive(HomeComponent));
    expect(homeComponent).not.toBeNull();
  }));

  it('should redirect to order details', fakeAsync(() => {
    router.navigate(['/order-details', 1]);
    tick();

    const orderDetailComponent = appFixture.queryOnDebugElement(By.directive(OrderDetailComponent));
    expect(orderDetailComponent).not.toBeNull();
  }));

  it('should redirect to customers', fakeAsync(() => {
    router.navigate(['/customers']);
    tick();
    
    const actual = appFixture.queryOnDebugElement(By.directive(CustomerListComponent));
    
    expect(actual).not.toBeNull();
  }));
});
