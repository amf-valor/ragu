import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { RaguService } from 'src/app/shared/ragu.service';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends RaguService{
  
  constructor(private readonly httpClient: HttpClient) {
    super('orders');
  }

  getByCreation(creationDate: Date): Observable<Order[]> {
    return this.httpClient
      .get<Order[]>(`${this.Uri}?creationDate=${creationDate.toISOString()}`)
      .pipe(catchError(this.handleError));
  }
}
