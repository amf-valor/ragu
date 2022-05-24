import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";
import { DeliveryLocalesService } from "./delivery-locales.service";

let deliveryLocaleService: DeliveryLocalesService;

const URI = `${environment.raguBaseUrl}/api/deliveryLocales`;
const expectedErrorMessage = 'something unexpected occurred!';

describe('DeliveryLocales service', () => {
    beforeEach(() => { 
        TestBed.configureTestingModule({ 
            imports:[HttpClientTestingModule],
            providers: [
                DeliveryLocalesService,
                HttpClientModule,
                MessageService
            ] 
        });
        
        deliveryLocaleService = TestBed.inject(DeliveryLocalesService);
    });
    
    it('GIVEN a delivery locale WHEN post to the server fail THEN should return the error something unexpected occured!', () => {
        const httpTest =  TestBed.inject(HttpTestingController);
        
        deliveryLocaleService.post({ hood: 'any', tax:20.00 }).subscribe({
            next: () => fail('expected error, not post succeded'),
            error: error => expect(error.message).toBe(expectedErrorMessage)
        });
        
        const req = httpTest.match(URI)[0];
        expect(req).withContext(`it was not found any request for: ${URI}`).toBeDefined();
        req.flush('', new HttpErrorResponse({status: 500, statusText: 'Internal Server Error'}));
    });

    it('GIVEN an error occurred WHEN get all delivery locales THEN should return the error something unexpected occured!', () => {
        const httpTest =  TestBed.inject(HttpTestingController);
        
        deliveryLocaleService.getAll().subscribe({
            next: () => fail('expected error, not post succeded'),
            error: error => expect(error.message).toBe(expectedErrorMessage)
        });
        
        const req = httpTest.match(URI)[0];
        expect(req).withContext(`it was not found any request for: ${URI}`).toBeDefined();
        req.flush('', new HttpErrorResponse({status: 500, statusText: 'Internal Server Error'}));
    });

    it('GIVEN an error occurred WHEN delete delivery locales THEN should return the error something unexpected occured!', () => {
        const httpTest =  TestBed.inject(HttpTestingController);
        
        deliveryLocaleService.delete(0).subscribe({
            next: () => fail('expected error, not delete succeded'),
            error: error => expect(error.message).toBe(expectedErrorMessage)
        });
        
        const req = httpTest.match(`${URI}/0`)[0];
        expect(req).withContext(`it was not found any request for: ${URI}/0`).toBeDefined();
        req.flush('', new HttpErrorResponse({status: 500, statusText: 'Internal Server Error'}));
    });
});