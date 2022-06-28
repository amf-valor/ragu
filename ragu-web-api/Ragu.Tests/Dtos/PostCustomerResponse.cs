namespace Ragu.Tests.Dtos;

public class PostCustomerResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long? PhoneNumber { get; set; }
    public string Street { get; set; } = string.Empty;
    public int StreetNumber { get; set; }
    public string Neighborhood { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
}