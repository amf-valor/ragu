export interface Customer{
    name: string,
    phone: number,
    street: string,
    streetNumber: number,
    neighborhood: string,
    city: string
}

export const defaultCustomer : Customer = {
    name: "",
    phone: 0,
    street: "",
    streetNumber: 0,
    neighborhood: "",
    city: ""
};