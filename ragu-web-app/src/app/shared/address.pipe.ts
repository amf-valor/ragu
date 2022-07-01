import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../models/address.model';


@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {

  transform(address: Address): string {
    return `${address.street}, ${address.streetNumber} ${address.neighborhood.toUpperCase()} - ${address.city}`;
  }

}
