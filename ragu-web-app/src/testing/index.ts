//we can flush pretty much anything
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fireEvent } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Message, MessageService } from 'primeng/api';
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

async function givenInputExpectOnlyNumbersAndCurrencyFormat(input: HTMLInputElement){
    await userEvent.type(input, 'as');
    expect(input.textContent).toBe('');

    fireEvent.change(input, {target:{value: "20"}});
    fireEvent.blur(input);
    //the replace is needed because the value is an HTML string from input
    //angular pipe, after formating, it turns to R$&nbsp20,00 which was 
    //breaking the comparision against R$ 20,00 and failing the test silently.
    expect(replaceNbspByEmptySpace(input.value)).toEqual('R$ 20,00');
}

function replaceNbspByEmptySpace(value: string): ArrayLike<string> {
  const nbspUnicodePattern = /\u00A0/g;
  return value.replace(nbspUnicodePattern, ' ');
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
  
  matchAndFlushEmpty(url: string) {
    const testRequest = this.matchFirst(url);
    testRequest.flush({});
  }

  private matchFirst(url: string) {
    const testRequests = this.httpTestingController.match(url);

    if (testRequests.length === 0)
      throw new Error('Make sure any request was made.');
    
    return testRequests[0];
  }

  matchAndFlushInternalServerError(url: string) {
    const testRequest = this.matchFirst(url);
    testRequest.flush('', Mother.internalServerError());
  }
}

class Page<T>{
  constructor(private readonly _fixture: ComponentFixture<T>){}

  typeAndLeave(inputNumber: HTMLInputElement, text: string){
    fireEvent.change(inputNumber, { target: { value: text } });
    fireEvent.blur(inputNumber);
    this._fixture.detectChanges();
  }
}

export { 
  GENERIC_ERROR_MESSAGE,
  expectErrorWithMessage,
  givenInputExpectOnlyNumbersAndCurrencyFormat, 
  Mother, 
  HttpTestingControllerHelper,
  Page 
};
