import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GENERIC_ERROR_MESSAGE, Mother } from 'src/testing';
import { OrderService } from './order-ragu.service';

fdescribe('OrderService', () => {
  class HttpTestingControllerHelper {
    constructor(private httpTestingController: HttpTestingController) {}

    expectFirstStartsWith(url: string): TestRequest{
      const testRequest = this.httpTestingController.match(request => request.url.startsWith(url))[0];
      expect(testRequest).withContext(`it was not found any request for: ${url}`).toBeDefined();
      return testRequest;
    }
  }

  let orderService: OrderService;
  let httpTestingController: HttpTestingController;
  let httpTestingControllerHelper: HttpTestingControllerHelper;
  
  const uri = `${environment.raguBaseUrl}/api/orders`;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });

    orderService = TestBed.inject(OrderService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpTestingControllerHelper = new HttpTestingControllerHelper(httpTestingController);
  });

  afterEach(() => { httpTestingController.verify(); });

  it('should get by creation date', () => {
    const firstMayOf22  = new Date(Date.UTC(2022, 4, 1, 0, 0, 0, 0));
    const ordersOfJoao = [Mother.orderOfJoao()];
    
    orderService.getByCreation(firstMayOf22).subscribe(orders => {
      expect(orders).toEqual(ordersOfJoao);
    });
    
    const testRequest = httpTestingController
      .expectOne(`${uri}?creation_date=2022-05-01T00:00:00.000Z`);
    
    expect(testRequest.request.method).toBe('GET');
    
    testRequest.flush(ordersOfJoao);
  });

  it('should return the error when something unexpected occured!', () => {
    expectErrorWithMessage(orderService.getByCreation(new Date()), GENERIC_ERROR_MESSAGE);

    const testRequest = httpTestingControllerHelper.expectFirstStartsWith(uri);
    
    testRequest.flush('', Mother.internalServerError());
  });

  function expectErrorWithMessage(observable: Observable<unknown>, message: string){
    observable.subscribe({
      next: () => fail('expected error, not observable succeded'),
      error: error => expect(error.message).toBe(message)
    });
  }
});
