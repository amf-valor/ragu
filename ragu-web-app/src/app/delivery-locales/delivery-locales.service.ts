import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeliveryLocale } from './delivery-locale.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryLocalesService {
  
  private readonly Uri = `${environment.raguBaseUrl}/api/deliveryLocales`;

  constructor(private httpClient: HttpClient) { }
  
  post(deliveryLocale: DeliveryLocale) : Observable<DeliveryLocale> {
    return this.httpClient.post<DeliveryLocale>(this.Uri, deliveryLocale)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getAll(): Observable<DeliveryLocale[]> {
    return this.httpClient.get<DeliveryLocale[]>(this.Uri)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(){
    return throwError(() => new Error('something unexpected occurred!'));
  }
}
