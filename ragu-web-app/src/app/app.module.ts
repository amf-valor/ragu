import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuModule } from './menu/menu.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeliveryLocalesModule } from './delivery-locales/delivery-locales.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { environment } from 'src/environments/environment';
import { RaguInMemoryDbService } from 'src/ragu-in-memory-db.service';
import { HomeModule } from './home/home.module';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { ProductsModule } from './products/products.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    DeliveryLocalesModule,
    HttpClientModule,
    ToastModule,
    HomeModule,
    OrderDetailModule,
    ProductsModule,
    environment.useInMemoryApi ? HttpClientInMemoryWebApiModule.forRoot(RaguInMemoryDbService) : [] 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
