import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DeliveryLocale } from './delivery-locale.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryLocalesService {
  
  
  constructor(private httpClient: HttpClient) { }
  
  post(deliveryLocale: DeliveryLocale) : Observable<DeliveryLocale> {
    return this.httpClient.post<DeliveryLocale>('api/deliveryLocales', deliveryLocale)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getAll(): Observable<DeliveryLocale[]> {
    return this.httpClient.get<DeliveryLocale[]>('api/deliveryLocales')
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(){
    return throwError(() => new Error('something unexpected occurred!'));
  }
}
