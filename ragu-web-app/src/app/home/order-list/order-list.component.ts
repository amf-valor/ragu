import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, takeWhile } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order-ragu.service';

@Component({
  selector: 'ragu-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy{
  orders$: Observable<Order[]> = of([]);

  private _isActive = true;

  constructor(private readonly orderService: OrderService, 
    private readonly router:Router, 
    private readonly notificationService:NotificationService){}
  
  ngOnInit() {
    const today = new Date();
		today.setHours(0, 0, 0, 0);
    this.loadAndSortOrders(today);
  }
  
  ngOnDestroy(): void {
    this._isActive = false;
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

  onCustomerNameClick(id: number){
    this.router.navigate(['/order-details', id]);
  }

  onRemoveOrderButtonClick(id: number){
    this.orderService.remove(id)
      .pipe(
        takeWhile(() => this._isActive),
      ).subscribe({
        error: () => {
          this.notificationService.notifyError();
        },
        complete: () => {   
          this.orders$ = this.orders$.pipe(
            map(orders => orders.filter(order => order.id !== id))
          );  
        }
      });
  }
}
