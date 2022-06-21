namespace Ragu.Core;

public class Customer
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public long? PhoneNumber { get; set; }

    public Customer(string name)
    {
        Name = name;
    }
}