import { InMemoryDbService } from "angular-in-memory-web-api";

interface DbCustomer {
  name: string,
  phoneNumber: number,
  address: DbAddress
}

interface DbAddress{
  street: string,
  streetNumber: number,
  neighborhood: string,
  city: string
}

interface DbProduct {
  id: number
  name: string,
  price: number
}

interface DbOrder {
  id: number,
  customerName: string,
  customer: DbCustomer
  subtotal: number,
  deliveryTax: number,
  isPaid: boolean,
  total: number,
  ofDay: string,
  bookedAt: string,
  products: DbProduct[]
}

interface DbDeliveryLocale {
  id: number,
  hood: string,
  tax: number
}

export class RaguInMemoryDbService extends InMemoryDbService {

  createDb(): { deliveryLocales: DbDeliveryLocale[], orders: DbOrder[], products: DbProduct[], customers: DbCustomer[] } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      deliveryLocales: [
        {
          "id": 1,
          "hood": "itagua - in memory",
          "tax": 3.00
        },
        {
          "id": 2,
          "hood": "centro - in memory",
          "tax": 4.00
        }
      ],
      orders: [
        {
          id: 1,
          customerName: 'João',
          customer: {
            name: 'João',
            phoneNumber: 15986254196,
            address:{
              street: 'Rua euclides da cunha',
              city: 'Ubatuba',
              neighborhood: 'Itagua',
              streetNumber: 55
            }
            
          },
          subtotal: 68.70,
          deliveryTax: 4.00,
          isPaid: false,
          total: 72.70,
          ofDay: today.toISOString(),
          bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDay(), 12, 0, 0, 0).toISOString(),
          products: [
            { id:1, name: 'ragu', price: 10.0 }
          ]
        },
        {
          id: 2,
          customerName: 'Natalia',
          customer: {
            name: 'Natalia',
            phoneNumber: 12986254104,
            address: {
              street: 'Rua ernesto evans',
              city: 'Sao paulo',
              neighborhood: 'Sao miguel',
              streetNumber: 578
            }
          },
          subtotal: 68.70,
          deliveryTax: 4.00,
          isPaid: true,
          total: 72.70,
          ofDay: today.toISOString(),
          bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDay(), 11, 0, 0, 0).toISOString(),
          products: [
            { id: 2, name: 'feijoada', price: 30.0 }
          ]
        }
      ],
      products:[
        {
          id: 3,
          name: 'tapioca',
          price: 12.0
        }
      ],
      customers:[
        {
          name: 'Natalia',
          phoneNumber: 12986254104,
          address: {
            street: 'Rua ernesto evans',
            city: 'Sao paulo',
            neighborhood: 'Sao miguel',
            streetNumber: 578
          }
        },
        {
          name: 'João',
          phoneNumber: 15986254196,
          address:{
            street: 'Rua euclides da cunha',
            city: 'Ubatuba',
            neighborhood: 'Itagua',
            streetNumber: 55
          }
          
        }
      ]
    };
  }

}