import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Mother } from 'src/testing/mother';
import { OrderService } from './order-ragu.service';


fdescribe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });

    service = TestBed.inject(OrderService);
  });

  it('should get by creation date', () => {
    const firstMayOf22  = new Date(Date.UTC(2022, 4, 1, 0, 0, 0, 0));
    const ordersOfJoao = [Mother.orderOfJoao()];
    
    service.getByCreation(firstMayOf22).subscribe(orders => {
      expect(orders).toEqual(ordersOfJoao);
    });
    
    const httpTestingController = TestBed.inject(HttpTestingController);
    
    const testRequest = httpTestingController
      .expectOne(`${environment.raguBaseUrl}/api/orders?creation_date=2022-05-01T00:00:00.000Z`);
    
    expect(testRequest.request.method).toBe('GET');
    
    testRequest.flush(ordersOfJoao);
    httpTestingController.verify();
  });

  it('should return the error something unexpected occured!', () => {
    const httpTest = TestBed.inject(HttpTestingController);
    const expectedErrorMessage = 'something unexpected occurred!';
    const URI = `${environment.raguBaseUrl}/api/orders`;

    service.getByCreation(new Date()).subscribe({
      next: () => fail('expected error, not getBycreation succeded'),
      error: error => expect(error.message).toBe(expectedErrorMessage)
    });

    const req = httpTest.match(request => request.url.startsWith(URI))[0];
    expect(req).withContext(`it was not found any request for: ${URI}`).toBeDefined();
    
    req.flush('', new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }));
  });
});
