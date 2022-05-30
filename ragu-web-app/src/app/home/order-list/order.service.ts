import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  getByCreation(creationDate: Date): Observable<Order[]> {
    throw Error('not implemented');
  }
}
