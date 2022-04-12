import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenubarModule } from 'primeng/menubar'; 



@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    MenubarModule
  ],
  exports:[
    MenuComponent
  ]
})
export class MenuModule { }
