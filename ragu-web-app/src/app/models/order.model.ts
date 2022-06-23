export interface Order{
    id: number,
    customerName: string,
    subtotal: number,
    deliveryTax: number,
    total: number,
    isPaid: boolean
    bookedAt: Date
}