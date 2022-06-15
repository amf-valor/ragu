import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { OrderDetails } from "src/app/models/order-detail.model";
import { RaguService } from 'src/app/services/ragu.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends RaguService{
  
  constructor(private readonly httpClient: HttpClient) {
    super('orders');
  }

  getBookedOfWholeDay(ofDay: Date): Observable<Order[]> {
    return this.httpClient
    .get<Order[]>(`${this.uri}?ofDay=${ofDay.toISOString()}`)
    .pipe(catchError(this.handleError));
  }

  getOrderDetails(id: number): Observable<OrderDetails> {
    return this.httpClient.get<OrderDetails>(`${this.uri}/${id}`);
  }
}
