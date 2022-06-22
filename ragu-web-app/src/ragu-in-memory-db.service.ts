import { InMemoryDbService } from "angular-in-memory-web-api";

interface DbCustomer {
  name: string,
  phone: number,
  street: string,
  streetNumber: number,
  neighborhood: string,
  city: string
}

interface DbProduct {
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

  createDb(): { deliveryLocales: DbDeliveryLocale[], orders: DbOrder[] } {
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
            phone: 15986254196,
            street: 'Rua euclides da cunha',
            city: 'Ubatuba',
            neighborhood: 'Itagua',
            streetNumber: 55
          },
          subtotal: 68.70,
          deliveryTax: 4.00,
          isPaid: false,
          total: 72.70,
          ofDay: today.toISOString(),
          bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDay(), 12, 0, 0, 0).toISOString(),
          products: [
            { name: 'ragu', price: 10.0 }
          ]
        },
        {
          id: 2,
          customerName: 'Natalia',
          customer: {
            name: 'Natalia',
            phone: 12986254104,
            street: 'Rua ernesto evans',
            city: 'Sao paulo',
            neighborhood: 'Sao miguel',
            streetNumber: 578
          },
          subtotal: 68.70,
          deliveryTax: 4.00,
          isPaid: true,
          total: 72.70,
          ofDay: today.toISOString(),
          bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDay(), 11, 0, 0, 0).toISOString(),
          products: [
            { name: 'feijoada', price: 30.0 }
          ]
        }
      ]
    };
  }

}