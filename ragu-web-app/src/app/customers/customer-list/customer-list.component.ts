import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, takeWhile } from 'rxjs';
import { Customer } from 'src/app/models/customer.model';
import { CustomerRaguService } from 'src/app/services/customer-ragu.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  private _isActive = true;
  
  private readonly _customerSource = new BehaviorSubject<Customer[]>([]);
  customers$: Observable<Customer[]> = this._customerSource.asObservable();

  constructor(private readonly _customerRaguService: CustomerRaguService) { }
  
  ngOnDestroy(): void {
    this._isActive = false;
  }

  ngOnInit(): void {
    this._customerRaguService.get()
      .pipe(takeWhile(() => this._isActive))
      .subscribe({
        next: customers => {
          this._customerSource.next(customers);
        }
      });
  }

}
