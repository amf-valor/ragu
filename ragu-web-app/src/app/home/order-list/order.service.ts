import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  constructor(private readonly httpClient: HttpClient) {}

  getByCreation(creationDate: Date): Observable<Order[]> {
    return this.httpClient
      .get<Order[]>(`${environment.raguBaseUrl}/api/orders?creation_date=${creationDate.toISOString()}`);
  }
}
