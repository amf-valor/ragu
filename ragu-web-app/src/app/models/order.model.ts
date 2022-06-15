export interface Order{
    id: number,
    customerName: string,
    value: number,
    deliveryTax: number,
    total: number,
    isPaid: boolean
    bookedAt: Date
}