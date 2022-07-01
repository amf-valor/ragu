import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { RaguService } from './ragu.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerRaguService extends RaguService {
  
  constructor(private readonly _httpClient: HttpClient) {
    super("customers");
  }
  
  get(): Observable<Customer[]> {
    return this._httpClient.get<Customer[]>(this.uri);
  }
}
