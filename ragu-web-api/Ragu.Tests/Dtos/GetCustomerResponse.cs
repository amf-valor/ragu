namespace Ragu.Tests.Dtos;

internal class GetCustomerResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long? PhoneNumber { get; set; }
    public string Street { get; set; } = string.Empty;
    public int StreetNumber { get; set; }
    public string Neighborhood { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
}