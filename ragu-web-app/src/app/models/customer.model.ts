import { Address } from "./address.model";

export interface Customer {
  name: string,
  phoneNumber?: number,
  address: Address
}

export const defaultCustomer: Customer = {
  name: "",
  phoneNumber: 0,
  address: {
    street: "",
    city: "",
    neighborhood: "",
    streetNumber:0
  }
};