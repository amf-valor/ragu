import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DataViewModule } from 'primeng/dataview';
import { HomeComponent } from './home.component';
import { OrderListComponent } from './order-list/order-list.component';


@NgModule({
  declarations: [OrderListComponent, HomeComponent],
  imports: [
    CommonModule,
    DataViewModule,
    CalendarModule,
    NoopAnimationsModule,
    RouterModule
  ]
})
export class HomeModule { }
