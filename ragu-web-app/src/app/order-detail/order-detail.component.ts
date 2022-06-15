import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OrderService } from '../services/order-ragu.service';
import { OrderDetails } from './order-detail.model';

@Component({
  selector: 'ragu-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})

export class OrderDetailComponent implements OnInit {

  orderDetails$: Observable<OrderDetails> = of();
  
  constructor(private readonly orderService: OrderService, private readonly route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.orderDetails$ = this.orderService.getOrderDetails(id);
  }

}
