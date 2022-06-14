import { HttpErrorResponse } from "@angular/common/http";
import { Order } from "src/app/home/order-list/order.model";

export class Mother {
  
  static ordersOfJoaoJoanaAndMarcelo(): Order[] {
    return [
      Mother.orderOfJoao(),
      Mother.orderOfJoana(),
      Mother.orderOfMarcelo() 
    ];
  }

  static orderOfJoao(): Order {
    return this.createOrderOnFirstMay(1, "João", false, 12, 30);
  }

  static orderOfJoana(): Order{
    return Mother.createOrderOnFirstMay(2, "Joana", true, 11, 0);
  }

  static orderOfMarcelo(): Order{
    return Mother.createOrderOnFirstMay(3, "Marcelo", false, 12, 0);
  }
  

  private static createOrderOnFirstMay(id: number,
                                       customer: string,  
                                       isPaid: boolean, 
                                       hour: number, 
                                       minute:number): Order {
    return {
      id: id,
      customerName: customer,
      value: 68.70,
      deliveryTax: 4.00,
      isPaid: isPaid,
      total: 72.70,
      bookedAt: Mother.mayFirstAt(hour, minute)
    };
  }

  private static mayFirstAt(hours: number, minutes: number): Date {
    return new Date(2022, 4, 1, hours, minutes);
  }

  static mayFirst(): Date {
    return this.mayFirstAt(0, 0);
  }

  static internalServerError(): HttpErrorResponse {
    return new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
  }
}