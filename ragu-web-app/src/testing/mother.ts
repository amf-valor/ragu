import { HttpErrorResponse } from "@angular/common/http";
import { Order } from "src/app/home/order-list/order.model";

export class Mother {

  static internalServerError(): HttpErrorResponse {
    return new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' })
  }

  static orderOfJoao(): Order {
    return {
      customerName: "João",
      value: 68.70,
      deliveryTax: 4.00,
      isPaid: false,
      total: 72.70
    };
  }
}