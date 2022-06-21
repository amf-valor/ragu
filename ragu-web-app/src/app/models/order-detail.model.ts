import { Customer } from "./customer.model";
import { Product } from "./product.model";


export interface OrderDetails {
  customer: Customer; 
  bookedAt: Date;
  products: Product[];
}
