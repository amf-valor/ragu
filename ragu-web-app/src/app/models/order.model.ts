export interface Order{
    id: number,
    customerName: string,
    subTotal: number,
    deliveryTax: number,
    total: number,
    isPaid: boolean
    bookedAt: Date
}