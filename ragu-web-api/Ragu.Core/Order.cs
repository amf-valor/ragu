namespace Ragu.Core;

public class Order
{
    public int Id { get => _id; }
    private readonly int _id;
    public decimal SubTotal { get => _products.Sum(_ => _.Price); }
    public decimal DeliveryTax { get; private set; }
    public DateTimeOffset BookedAt { get; private set; }
    public bool IsPaid { get; private set; }
    public decimal Total { get => SubTotal + DeliveryTax; }
    public IReadOnlyCollection<Product> Products { get => _products.AsReadOnly(); }
    public Customer Owner { get; private set; }

    private readonly List<Product> _products;

    private Order()
    {
        Owner = new Customer(string.Empty);
        _products = new List<Product>();
    }

    public Order(Customer owner, decimal deliveryTax, DateTimeOffset bookedAt)
    {
        DeliveryTax = deliveryTax;
        BookedAt = bookedAt;
        IsPaid = false;
        _products = new List<Product>();
        Owner = owner;
    }

    public void AddItem(Product newItem)
    {
        _products.Add(newItem);
    }
}