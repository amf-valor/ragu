import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailComponent } from './order-detail.component';



@NgModule({
  declarations: [OrderDetailComponent],
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    SharedModule
  ]
})
export class OrderDetailModule { }
