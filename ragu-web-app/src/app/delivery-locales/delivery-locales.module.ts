import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { DeliveryLocalesComponent } from './delivery-locales.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [DeliveryLocalesComponent],
  imports: [
    FormsModule,
    CommonModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  providers:[{provide: LOCALE_ID, useValue: 'pt'}, {provide: DEFAULT_CURRENCY_CODE, useValue:'BRL'}]
  
})
export class DeliveryLocalesModule { }
