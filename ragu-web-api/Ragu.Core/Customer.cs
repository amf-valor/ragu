namespace Ragu.Core;

public class Customer
{
    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public long? PhoneNumber { get; set; }
    public string Street { get; set; } = string.Empty;
    public int StreetNumber { get; set; }
    public string Neighborhood { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    internal Customer() { }
    public Customer(string name, string street, int streetNumber, string neighborhood, string city)
    {
        Name = name;
        Street = street;
        StreetNumber = streetNumber;
        Neighborhood = neighborhood;
        City = city;
    }
}