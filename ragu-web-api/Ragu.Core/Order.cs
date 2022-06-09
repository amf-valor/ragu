namespace Ragu.Core;

public class Order
{
    private readonly int _id;
    public int Id { get => _id; }
    public string CustomerName { get; private set; }
    public decimal Value { get; private set; }
    public decimal DeliveryTax { get; private set; }
    public DateTimeOffset BookedAt { get; private set; }
    public bool IsPaid { get; private set; }
    public decimal Total { get => Value + DeliveryTax; }

    public Order(string customerName, decimal value, decimal deliveryTax, DateTimeOffset bookedAt)
    {
        CustomerName = customerName;
        Value = value;
        DeliveryTax = deliveryTax;
        BookedAt = bookedAt;
        IsPaid = false;
    }

}