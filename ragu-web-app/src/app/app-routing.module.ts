import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryLocalesComponent } from './delivery-locales/delivery-locales.component';
import { HomeComponent } from './home/home.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'delivery-locales', component: DeliveryLocalesComponent },
  { path: 'order-details/:id', component: OrderDetailComponent,  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
