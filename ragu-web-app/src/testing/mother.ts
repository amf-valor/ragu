import { HttpErrorResponse } from "@angular/common/http";
import { Order } from "src/app/home/order-list/order.model";

export class Mother {
  static unorderedOrders(): Partial<Order>[] {
    return [
      { bookedAt: Mother.FirstMayAt(12, 30) },
      { bookedAt: Mother.FirstMayAt(11, 0) },
      { bookedAt: Mother.FirstMayAt(12, 0) }
    ];
  }

  static internalServerError(): HttpErrorResponse {
    return new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
  }

  static orderOfJoao(): Order {
    return {
      customerName: "João",
      value: 68.70,
      deliveryTax: 4.00,
      isPaid: false,
      total: 72.70,
      bookedAt: Mother.FirstMayAt(12, 30)
    };
  }
  

  private static FirstMayAt(hours: number, minutes: number): Date {
    return new Date(2022, 4, 1, hours, minutes);
  }
}