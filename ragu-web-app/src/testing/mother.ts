import { Order } from "src/app/home/order-list/order.model";

export class Mother{

    static orderOfJoao(): Order{
        return {
          customerName: "João",
          value: 68.70,
          deliveryTax: 4.00,
          isPaid: false,
          total: 72.70
        };
    }
}