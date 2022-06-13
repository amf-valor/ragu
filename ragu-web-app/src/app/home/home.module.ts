import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
    NoopAnimationsModule
  ]
})
export class HomeModule { }
