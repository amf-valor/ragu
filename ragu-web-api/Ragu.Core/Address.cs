namespace Ragu.Core;

public class Address
{
    public string Street { get; internal set; } = string.Empty;
    public int StreetNumber { get; internal set; }
    public string Neighborhood { get; internal set; } = string.Empty;
    public string City { get; internal set; } = string.Empty;

    internal Address() { }
    public class Builder
    {
        private readonly Address _address;

        public Builder()
        {
            _address = new Address();
        }

        public Address Build()
        {
            ThrowIfIsNullOrEmpty(_address.Street, "street");
            ThrowIfIsNullOrEmpty(_address.Neighborhood, "neighborhood");
            ThrowIfIsNullOrEmpty(_address.City, "city");
            return _address;
        }

        private static void ThrowIfIsNullOrEmpty(string @string, string parameter)
        {
            if (string.IsNullOrEmpty(@string))
                throw new InvalidOperationException($"cannot build address with null or empty {parameter}");
        }

        public Builder WithStreet(string street)
        {
            _address.Street = street;
            return this;
        }

        public Builder WithNumber(int number)
        {
            _address.StreetNumber = number;
            return this;
        }

        public Builder WithNeighborhood(string neighborhood)
        {
            _address.Neighborhood = neighborhood;
            return this;
        }

        public Builder WithCity(string city)
        {
            _address.City = city;
            return this;
        }
    }
}