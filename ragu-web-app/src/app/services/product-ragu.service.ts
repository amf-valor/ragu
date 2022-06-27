import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { RaguService } from './ragu.service';

@Injectable({
  providedIn: 'root'
})
export class ProductRaguService extends RaguService {
  
  
  constructor(private readonly _httpClient: HttpClient) 
  { 
    super('products');
  }
  
  post(product: Product): Observable<Product> {
    return this._httpClient.post<Product>(this.uri, product)
    .pipe(catchError(this.handleError));
  }

  get(): Observable<Product[]> {
    return this._httpClient.get<Product[]>(this.uri)
      .pipe(catchError(this.handleError));
  }
}
