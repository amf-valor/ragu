import { Product } from "./product.model";


export interface OrderDetails {
  bookedAt: Date;
  products: Product[];
}
