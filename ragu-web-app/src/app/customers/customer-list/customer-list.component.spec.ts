import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen, within } from '@testing-library/dom';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpTestingControllerHelper, Mother } from 'src/testing';
import { CustomerListComponent } from './customer-list.component';


describe('CustomerListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerListComponent ],
      imports: [ 
        HttpClientTestingModule,
        DataViewModule,
        SharedModule 
      ]
    })
    .compileComponents();
  });

  describe('When component is created', () => {
    let fixture: ComponentFixture<CustomerListComponent>;
    let httpTestingControllerHelper: HttpTestingControllerHelper;
    
    const getCustomerRequestFn = (request: HttpRequest<unknown>) => 
      request.method === 'GET' && request.url === '/api/customers';

    beforeEach(() => {
      fixture = TestBed.createComponent(CustomerListComponent);
      fixture.detectChanges();
      httpTestingControllerHelper = new HttpTestingControllerHelper(TestBed.inject(HttpTestingController));
    });
  
    it('should get customers', () => {
      httpTestingControllerHelper.expectOneAndFlush(getCustomerRequestFn, Mother.joaoJoanaAndMarcelo());
      fixture.detectChanges();

      const actual = screen.getAllByTestId("customer-row");

      expect(actual.length).toBe(3);
    });

    it('should show customer row', () => {
      httpTestingControllerHelper.expectOneAndFlush(getCustomerRequestFn, [ Mother.joao() ]);
      fixture.detectChanges();

      const actual = within(screen.getByTestId("customer-row"));

      expect(actual.getByText('João')).toBeDefined();
      expect(actual.getByText('(12) 98625-4104'));
      expect(actual.getByText('Rua maracatu, 383 CENTRO - São Paulo'));
    });
  });

  
});
