import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { DataViewModule } from 'primeng/dataview';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    CustomerListComponent
  ],
  imports: [
    CommonModule,
    DataViewModule,
    SharedModule
  ]
})
export class CustomersModule { }
