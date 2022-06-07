import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { HomeComponent } from './home.component';
import {DataViewModule} from 'primeng/dataview';


@NgModule({
  declarations: [OrderListComponent, HomeComponent],
  imports: [
    CommonModule,
    DataViewModule
  ]
})
export class HomeModule { }
