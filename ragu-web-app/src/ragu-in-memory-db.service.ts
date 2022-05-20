import { InMemoryDbService } from "angular-in-memory-web-api";
import { DeliveryLocale } from "./app/delivery-locales/delivery-locale.model";

export class RaguInMemoryDbService extends InMemoryDbService{
    createDb(): { deliveryLocales: DeliveryLocale[] }{
        return{
            deliveryLocales:[
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
            ]
        };
    }

}