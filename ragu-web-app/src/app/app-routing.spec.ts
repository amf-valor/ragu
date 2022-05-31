import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

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
    await TestBed.configureTestingModule({
      declarations: [ 
        AppComponent, 
        HomeComponent, 
        MenuDummyComponent, 
        ToastDummyComponent,
        OrderListDummyComponent 
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
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
});
