export interface Order{
    customerName: string,
    value: number,
    deliveryTax: number,
    total: number,
    isPaid: boolean
    bookedAt: Date
}