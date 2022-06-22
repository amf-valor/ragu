import { Customer } from "./customer.model";
import { Product } from "./product.model";


export interface OrderDetails {
  customer: Customer; 
  bookedAt: Date;
  products: Product[];
  subtotal: number
  deliveryTax: number;
  total: number;
  isPaid: boolean;
}
