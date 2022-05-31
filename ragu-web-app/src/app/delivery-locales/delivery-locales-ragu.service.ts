import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { RaguService } from '../shared/ragu.service';
import { DeliveryLocale } from './delivery-locale.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryLocalesRaguService extends RaguService {
  
  constructor(private httpClient: HttpClient) {
    super('deliveryLocales');
  }
  
  delete(id: number) : Observable<void> {
    return this.httpClient.delete(`${this.Uri}/${id}`)
      .pipe(map(() => undefined), catchError(this.handleError));
  }

  post(deliveryLocale: DeliveryLocale) : Observable<DeliveryLocale> {
    return this.httpClient.post<DeliveryLocale>(this.Uri, deliveryLocale)
      .pipe(catchError(this.handleError));
  }
    
  getAll(): Observable<DeliveryLocale[]> {
    return this.httpClient.get<DeliveryLocale[]>(this.Uri)
      .pipe(catchError(this.handleError));
  }
}
