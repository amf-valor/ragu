import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { DeliveryLocale } from '../models/delivery-locale.model';
import { RaguService } from './ragu.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryLocalesRaguService extends RaguService {
  
  constructor(private httpClient: HttpClient) {
    super('deliveryLocales');
  }
  
  delete(id: number) : Observable<void> {
    return this.httpClient.delete(`${this.uri}/${id}`)
      .pipe(map(() => undefined), catchError(this.handleError));
  }

  post(deliveryLocale: DeliveryLocale) : Observable<DeliveryLocale> {
    return this.httpClient.post<DeliveryLocale>(this.uri, deliveryLocale)
      .pipe(catchError(this.handleError));
  }
    
  getAll(): Observable<DeliveryLocale[]> {
    return this.httpClient.get<DeliveryLocale[]>(this.uri)
      .pipe(catchError(this.handleError));
  }
}
