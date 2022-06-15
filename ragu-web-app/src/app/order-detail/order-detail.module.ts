import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail.component';
import { DataViewModule } from 'primeng/dataview';



@NgModule({
  declarations: [OrderDetailComponent],
  imports: [
    CommonModule,
    DataViewModule
  ]
})
export class OrderDetailModule { }
