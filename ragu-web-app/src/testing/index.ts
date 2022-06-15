//we can flush pretty much anything
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { Mother } from './mother';
import './tests-extensions';

const GENERIC_ERROR_MESSAGE = "something unexpected occurred!";

function expectErrorWithMessage(observable: Observable<unknown>, message: string) {
  observable.subscribe({
    next: () => fail('expected error, not observable succeded'),
    error: error => expect(error.message).toBe(message)
  });
}

class HttpTestingControllerHelper {
  constructor(private httpTestingController: HttpTestingController) {}
  
  expectFirstStartsWithAndFlush(url: string, toBeFlushed: any) {
    const testRequest = this.expectFirstStartsWith(url);
    testRequest.flush('', toBeFlushed);
  }
  
  expectFirstStartsWith(url: string): TestRequest{
    const testRequest = this.httpTestingController.match(request => request.url.startsWith(url))[0];
    expect(testRequest).withContext(`it was not found any request for: ${url}`).toBeDefined();
    return testRequest;
  }

  expectOneAndFlush(expectedUrl:string, tobeFlushed:any){
    const testRequest = this.httpTestingController.expectOne(expectedUrl);
    testRequest.flush(tobeFlushed);
  }
}

export { GENERIC_ERROR_MESSAGE, Mother, expectErrorWithMessage, HttpTestingControllerHelper };
