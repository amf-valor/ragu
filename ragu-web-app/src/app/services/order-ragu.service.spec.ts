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

  it('should get booked of whole day', () => {
    const firstMayOf22  = new Date(Date.UTC(2022, 4, 1, 0, 0, 0, 0));
    const ordersOfJoao = [Mother.orderOfJoao()];
    
    orderService.getBookedOfWholeDay(firstMayOf22).subscribe(orders => {
      expect(orders).toEqual(ordersOfJoao);
    });
    
    const testRequest = httpTestingController
      .expectOne(`${uri}?ofDay=2022-05-01T00:00:00.000Z`);
    
    expect(testRequest.request.method).toBe('GET');
    
    testRequest.flush(ordersOfJoao);
  });

  it('should throw generic error when getBookedOfWholeDay', () => {
    expectErrorWithMessage(orderService.getBookedOfWholeDay(new Date()), GENERIC_ERROR_MESSAGE);

    const testRequest = httpTestingControllerHelper.expectFirstStartsWith(uri);
    
    testRequest.flush('', Mother.internalServerError());
  });

  it('should call delete once when remove', () => {
    const orderOfJoaoId = Mother.orderOfJoao().id;

    orderService.remove(orderOfJoaoId).subscribe();

    const testRequest = httpTestingController.expectOne(`${uri}/${orderOfJoaoId}`);
    expect(testRequest.request.method).toBe('DELETE');
  });

  it('should throw generic error when remove', () => {
    expectErrorWithMessage(orderService.remove(0), GENERIC_ERROR_MESSAGE);

    const testRequest = httpTestingControllerHelper.expectFirstStartsWith(uri);
    
    testRequest.flush('', Mother.internalServerError());
  });
});
