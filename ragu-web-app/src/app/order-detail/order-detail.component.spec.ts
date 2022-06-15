import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { screen, within } from '@testing-library/angular';
import { DataViewModule } from 'primeng/dataview';
import { environment } from 'src/environments/environment';
import { HttpTestingControllerHelper, Mother } from 'src/testing';
import { OrderDetailComponent } from './order-detail.component';

describe('OrderDetailComponent', () => {
  let fixture: ComponentFixture<OrderDetailComponent>;
  let httpTestingControllerHelper: HttpTestingControllerHelper;

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
        }}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    httpTestingControllerHelper = new HttpTestingControllerHelper(TestBed.inject(HttpTestingController));
    fixture.detectChanges();
  });

  it('should show product', () =>{
    httpTestingControllerHelper.expectOneAndFlush(`${environment.raguBaseUrl}/api/orders/1`, Mother.orderDetailsOfJoao());
    fixture.detectChanges();

    const productElement = within(screen.getByTestId('product'));
    
    expect(productElement.getByText('ragu')).toBeDefined();
    expect(productElement.getByText(/R\$ 10,00/i));
  });
});
