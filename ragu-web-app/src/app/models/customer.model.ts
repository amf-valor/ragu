export interface Customer{
    name: string,
    phoneNumber?: number,
    street: string,
    streetNumber: number,
    neighborhood: string,
    city: string
}

export const defaultCustomer : Customer = {
    name: "",
    phoneNumber: 0,
    street: "",
    streetNumber: 0,
    neighborhood: "",
    city: ""
};