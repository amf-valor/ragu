import { Product } from "./product.model";


export interface OrderDetails {
  customerName: string;
  customerPhone: number; 
  bookedAt: Date;
  products: Product[];
}
