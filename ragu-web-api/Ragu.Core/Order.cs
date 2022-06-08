namespace Ragu.Core;

public class Order
{
    private readonly int _id;
    public int Id { get => _id; }
    public string CustomerName { get; private set; }
    public decimal Value { get; private set; }
    public decimal DeliveryTax { get; private set; }
    public DateTime BookedTo { get; private set; }
    public bool IsPaid { get; private set; }
    public Order(string customerName, decimal value, decimal deliveryTax, DateTime bookedTo)
    {
        CustomerName = customerName;
        Value = value;
        DeliveryTax = deliveryTax;
        BookedTo = bookedTo;
        IsPaid = false;
    }

}