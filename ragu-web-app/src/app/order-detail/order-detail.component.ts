import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { OrderDetails } from '../models/order-detail.model';
import { NotificationService } from '../services/notification.service';
import { OrderService } from '../services/order-ragu.service';

@Component({
  selector: 'ragu-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})

export class OrderDetailComponent implements OnInit {

  orderDetails$: Observable<OrderDetails> = of();
  
  constructor(private readonly orderService: OrderService, 
              private readonly route: ActivatedRoute,
              private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.orderDetails$ = this.orderService
      .getOrderDetails(id)
      .pipe(catchError(() => {
        this.notificationService.notifyError();
        return of();
      }));
  }

}
