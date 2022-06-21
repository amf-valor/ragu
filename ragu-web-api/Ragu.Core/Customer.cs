namespace Ragu.Core;

public class Customer
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public long PhoneNumber { get; private set; }

    public Customer(string name, long phoneNumber)
    {
        Name = name;
        PhoneNumber = phoneNumber;
    }
}