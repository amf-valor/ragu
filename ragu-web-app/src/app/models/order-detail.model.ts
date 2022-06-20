import { Product } from "./product.model";


export interface OrderDetails {
  customerName: string;
  bookedAt: Date;
  products: Product[];
}
