import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailComponent } from './order-detail.component';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderDetailComponent],
  imports: [
    CommonModule,
    DataViewModule,
    CardModule,
    SharedModule,
    DividerModule,
    CheckboxModule,
    FormsModule
  ]
})
export class OrderDetailModule { }
