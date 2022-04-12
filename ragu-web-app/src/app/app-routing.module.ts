import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryLocalesComponent } from './delivery-locales/delivery-locales.component';

export const routes: Routes = [{path: 'delivery-locales', component: DeliveryLocalesComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
