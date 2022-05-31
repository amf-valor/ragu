import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { HomeComponent } from './home.component';



@NgModule({
  declarations: [OrderListComponent, HomeComponent],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
