import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Order } from './order.model';
import { OrderService } from './order-ragu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ragu-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{
  orders$: Observable<Order[]> = of([]);

  constructor(private readonly orderService: OrderService, private readonly router:Router){}
 
  ngOnInit() {
    const today = new Date();
		today.setHours(0, 0, 0, 0);
    this.loadAndSortOrders(today);
  }
  
  private loadAndSortOrders(ofDay: Date) {
    this.orders$ = this.orderService
      .getBookedOfWholeDay(ofDay)
      .pipe(
        map(orders => orders.sort((firstOrder, secondOrder) => {
          const firstBookedAt = new Date(firstOrder.bookedAt);
          const secondBookedAt = new Date(secondOrder.bookedAt);
          return firstBookedAt.getTime() - secondBookedAt.getTime();
        }))
      );
  }

  onOrderCalendarSelect(selectedDay: Date){
    this.loadAndSortOrders(selectedDay);
  }

  onOrderClick(id: number){
    this.router.navigate(['/order-details', id]);
  }
}
