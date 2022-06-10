import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Order } from './order.model';
import { OrderService } from './order-ragu.service';

@Component({
  selector: 'ragu-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{
  orders$: Observable<Order[]> = of([]);

  constructor(private readonly orderService: OrderService){}
 
  ngOnInit() {
    const today = new Date();
		today.setHours(0, 0, 0, 0);

    this.orders$ = this.orderService
      .getBookedOfWholeDay(today)
      .pipe(
        map(orders => orders.sort((firstOrder, secondOrder) => {
          return firstOrder.bookedAt.getTime() - secondOrder.bookedAt.getTime();
        }))
      );
  }
}
