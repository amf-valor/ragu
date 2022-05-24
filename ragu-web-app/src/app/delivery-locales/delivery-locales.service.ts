import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeliveryLocale } from './delivery-locale.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryLocalesService {
  
  private readonly Uri = `${environment.raguBaseUrl}/api/deliveryLocales`;
  
  constructor(private httpClient: HttpClient) { }
  
  delete(id: number) : Observable<void> {
    return this.httpClient.delete(`${this.Uri}/${id}`)
      .pipe(map(() => {}), catchError(this.handleError));
  }

  post(deliveryLocale: DeliveryLocale) : Observable<DeliveryLocale> {
    return this.httpClient.post<DeliveryLocale>(this.Uri, deliveryLocale)
      .pipe(catchError(this.handleError));
  }
    
  getAll(): Observable<DeliveryLocale[]> {
    return this.httpClient.get<DeliveryLocale[]>(this.Uri)
      .pipe(catchError(this.handleError));
  }

  private handleError(httpBadResponse: HttpErrorResponse){
    httpBadResponse.status === 0 ?
    console.error('client side error', httpBadResponse.error):
    console.error(`server side error: ${httpBadResponse.status}`, httpBadResponse.error);
    
    return throwError(() => new Error('something unexpected occurred!'));
  }
}
