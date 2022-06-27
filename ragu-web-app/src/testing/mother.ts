import { HttpErrorResponse } from "@angular/common/http";
import { Message } from "primeng/api";
import { OrderDetails } from "src/app/models/order-detail.model";
import { Order } from "src/app/models/order.model";
import { Product } from "src/app/models/product.model";

export class Mother {
  static errorMessage(): Message{
    return {
      severity: 'error',
      summary: 'Oops!',
      detail: 'Desculpe o transtorno, mas algo inesperado ocorreu. Tente novamente mais tarde.'
    };
  }
  
  static orderDetailsOfJoana(): OrderDetails {
    return {
      customer: {
        name: 'Joana',
        street: 'Rua euclides da cunha',
        streetNumber: 55,
        neighborhood: 'itagua',
        city: 'Ubatuba'
      }, 
      bookedAt: this.mayFirstAt(11, 0),
      products: [{
        name: 'feijoada',
        price: 15.0
      }],
      subtotal: 15.0,
      deliveryTax: 9.0,
      total: 24.0,
      isPaid: true
    };
  }
  
  static orderDetailsOfJoao() : OrderDetails {
    return {
      customer: {
        name: 'João',
        phoneNumber: 12986254104,
        street: 'Rua maracatu',
        streetNumber: 383,
        neighborhood: 'centro',
        city: 'São Paulo'
      }, 
      bookedAt: this.mayFirstAt(13, 0),
      products: [{
        name: 'ragu',
        price: 10.0
      }],
      subtotal: 10.0,
      deliveryTax: 6.0,
      total: 16.0,
      isPaid: false 
    };
  }
  
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
        subtotal: 68.70,
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
  static raguAndTapioca(): Product[] {
    return [
      {
        id: 1,
        name: 'ragu',
        price: 10.0
      },
      {
        id: 2,
        name: 'tapioca',
        price: 5.0
      }
    ];
  }
}