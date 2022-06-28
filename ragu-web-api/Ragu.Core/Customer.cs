namespace Ragu.Core;

public class Customer
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public Address Home { get; private set; } = new Address();
    public long? PhoneNumber { get; set; }

    internal Customer() { }
    public Customer(string name, Address home, long? phoneNumber = null)
    {
        Name = name;
        Home = home;
        PhoneNumber = phoneNumber;
    }
}