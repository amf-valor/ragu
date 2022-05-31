import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Mother } from 'src/testing/mother';
import { OrderService } from './order.service';


describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });

    service = TestBed.inject(OrderService);
  });

  it('should get by creation date', () => {
    const firstMayOf22  = new Date(Date.UTC(2022, 4, 1, 0, 0, 0, 0));
    const dummyOrder = [Mother.orderOfJoao()];
    
    service.getByCreation(firstMayOf22).subscribe(orders => {
      expect(orders).toEqual(dummyOrder);
    });
    
    const httpTestingController = TestBed.inject(HttpTestingController);
    
    const testRequest = httpTestingController
      .expectOne(`${environment.raguBaseUrl}/api/orders?creation_date=2022-05-01T00:00:00.000Z`);
    
    expect(testRequest.request.method).toBe('GET');
    
    testRequest.flush(dummyOrder);
    httpTestingController.verify();
  });
});
