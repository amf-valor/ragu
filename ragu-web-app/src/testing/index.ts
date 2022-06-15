import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import './tests-extensions';
import { Mother } from './mother';

const GENERIC_ERROR_MESSAGE = "something unexpected occurred!";

function expectErrorWithMessage(observable: Observable<unknown>, message: string) {
  observable.subscribe({
    next: () => fail('expected error, not observable succeded'),
    error: error => expect(error.message).toBe(message)
  });
}

class HttpTestingControllerHelper {
  constructor(private httpTestingController: HttpTestingController) {}

  expectFirstStartsWith(url: string): TestRequest{
    const testRequest = this.httpTestingController.match(request => request.url.startsWith(url))[0];
    expect(testRequest).withContext(`it was not found any request for: ${url}`).toBeDefined();
    return testRequest;
  }

  //we can flush pretty much anything
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectOneAndFlush(expectedUrl:string, tobeFlushed:any){
    const testRequest = this.httpTestingController.expectOne(expectedUrl);
    testRequest.flush(tobeFlushed);
  }
}

export { GENERIC_ERROR_MESSAGE, Mother, expectErrorWithMessage, HttpTestingControllerHelper };