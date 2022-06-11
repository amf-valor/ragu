import { HttpErrorResponse } from "@angular/common/http";
import { Order } from "src/app/home/order-list/order.model";

export class Mother {
  static unorderedOrders(): Order[] {
    return [
      Mother.orderOfJoao(),
      Mother.orderOfJoana(),
      Mother.orderOfMarcelo() 
    ];
  }

  static internalServerError(): HttpErrorResponse {
    return new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
  }

  static orderOfJoao(): Order {
    return this.createOrderOnFirstMay("João", false, 12, 30);
  }

  static orderOfJoana(): Order{
    return Mother.createOrderOnFirstMay("Joana", true, 11, 0);
  }

  static orderOfMarcelo(): Order{
    return Mother.createOrderOnFirstMay("Marcelo", false, 12, 0);
  }
  

  private static createOrderOnFirstMay(customer: string,  
                                       isPaid: boolean, 
                                       hour: number, 
                                       minute:number): Order {
    return {
      customerName: customer,
      value: 68.70,
      deliveryTax: 4.00,
      isPaid: isPaid,
      total: 72.70,
      bookedAt: Mother.FirstMayAt(hour, minute)
    };
  }

  private static FirstMayAt(hours: number, minutes: number): Date {
    return new Date(2022, 4, 1, hours, minutes);
  }
}