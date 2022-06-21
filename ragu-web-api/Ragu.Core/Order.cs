namespace Ragu.Core;

public class Order
{
    public int Id { get => _id; }
    private readonly int _id;
    public string CustomerName { get; private set; }
    public decimal SubTotal { get => _products.Sum(_ => _.Price); }
    public decimal DeliveryTax { get; private set; }
    public DateTimeOffset BookedAt { get; private set; }
    public bool IsPaid { get; private set; }
    public decimal Total { get => SubTotal + DeliveryTax; }
    public IReadOnlyCollection<Product> Products { get => _products.AsReadOnly(); }
    public long CustomerPhoneNumber { get; set; }

    private readonly List<Product> _products;

    public Order(string customerName, decimal deliveryTax, DateTimeOffset bookedAt)
    {
        CustomerName = customerName;
        DeliveryTax = deliveryTax;
        BookedAt = bookedAt;
        IsPaid = false;
        _products = new List<Product>();
    }

    public void AddItem(Product newItem)
    {
        _products.Add(newItem);
    }
}