import { InMemoryDbService } from "angular-in-memory-web-api";
import { DeliveryLocale } from "./app/delivery-locales/delivery-locale.model";

interface DbOrder{
	id: number,
	customerName: string,
	value: number,
	deliveryTax: number,
	isPaid: boolean,
	total: number,
	creation_date: string
} 

export class RaguInMemoryDbService extends InMemoryDbService {
	
	createDb(): { deliveryLocales: DeliveryLocale[], orders: DbOrder[] } {
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
			orders:[
				{
					id: 1,
					customerName: "João",
					value: 68.70,
					deliveryTax: 4.00,
					isPaid: false,
					total: 72.70,
					creation_date: today.toISOString()
				},
				{
					id: 2,
					customerName: "Natalia",
					value: 68.70,
					deliveryTax: 4.00,
					isPaid: true,
					total: 72.70,
					creation_date: today.toISOString()
				}
			]
		};
	}

}