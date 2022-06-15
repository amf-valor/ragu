import { InMemoryDbService } from "angular-in-memory-web-api";

interface DbOrder{
	id: number,
	customerName: string,
	value: number,
	deliveryTax: number,
	isPaid: boolean,
	total: number,
	ofDay: string,
	bookedAt: string
} 

interface DbDeliveryLocale{
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
			orders:[
				{
					id: 1,
					customerName: "João",
					value: 68.70,
					deliveryTax: 4.00,
					isPaid: false,
					total: 72.70,
					ofDay: today.toISOString(),
					bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDay(), 12, 0, 0, 0).toISOString()
				},
				{
					id: 2,
					customerName: "Natalia",
					value: 68.70,
					deliveryTax: 4.00,
					isPaid: true,
					total: 72.70,
					ofDay: today.toISOString(),
					bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDay(), 11, 0, 0, 0).toISOString()
				}
			]
		};
	}

}