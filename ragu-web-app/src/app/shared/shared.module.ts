import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from './phone.pipe';
import { AddressPipe } from './address.pipe';



@NgModule({
  declarations: [
    PhonePipe,
    AddressPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    PhonePipe,
    AddressPipe
  ]
})
export class SharedModule { }
