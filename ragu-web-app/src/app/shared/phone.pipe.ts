import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(rawPhoneNumber: number | undefined): string {
    if(rawPhoneNumber === undefined)
      return "(00) 00000-0000";

    const toBeFormatted = rawPhoneNumber.toString();
    
    if(toBeFormatted.length != 11)
      throw new Error('Phone pipe only support format phone number which has length of 11');

    return toBeFormatted.replace(/(\d{2})?(\d{5})?(\d{4})/, "($1) $2-$3");
  }

}
