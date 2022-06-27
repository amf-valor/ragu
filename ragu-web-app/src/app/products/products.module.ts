import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';



@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    DataViewModule
  ]
})
export class ProductsModule { }
