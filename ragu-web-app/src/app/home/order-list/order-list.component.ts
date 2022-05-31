import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    this.orders$ = this.orderService.getByCreation(new Date());
  }
}
