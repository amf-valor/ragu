import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MessageService } from "primeng/api";
import { DeliveryLocalesService } from "./delivery-locales.service";

let deliveryLocaleService: DeliveryLocalesService;


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
            error: error => expect(error.message).toBe('something unexpected occurred!')
        });
        
        const req = httpTest.match('api/deliveryLocales')[0];
        req.flush('', new HttpErrorResponse({status: 500, statusText: 'Internal Server Error'}));
    });
});