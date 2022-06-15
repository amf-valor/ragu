import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    BrowserAnimationsModule,
    RouterModule
  ]
})
export class HomeModule { }
