import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { DeliveryLocalesComponent } from './delivery-locales/delivery-locales.component';
import { HomeComponent } from './home/home.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'delivery-locales', component: DeliveryLocalesComponent },
  { path: 'order-details/:id', component: OrderDetailComponent, },
  { path: 'products', component: ProductsComponent },
  { path: 'customers', component: CustomerListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
