namespace Ragu.Core;

public class Product
{
    public int Id { get => _id; }
    private readonly int _id;
    public string Name { get; private set; }
    public decimal Price { get; private set; }
    public IReadOnlyCollection<Order> Orders { get => _orders.AsReadOnly(); }
    public bool IsDeleted { get; set; }

    private readonly List<Order> _orders;

    public Product(string name, decimal price)
    {
        Name = name;
        Price = price;
        _orders = new List<Order>();
    }
}