import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { expectErrorWithMessage, GENERIC_ERROR_MESSAGE, HttpTestingControllerHelper, Mother } from 'src/testing';
import { OrderService } from './order-ragu.service';

describe('OrderService', () => {
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
});
