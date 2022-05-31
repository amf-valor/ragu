import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryLocalesComponent } from './delivery-locales/delivery-locales.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'delivery-locales', component: DeliveryLocalesComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
