using Ragu.Core;

namespace Ragu.Services;

public class OrderService
{
    public ICollection<Order> GetByBookedFrom(DateTimeOffset bookedFrom)
    {
        return new List<Order>
        {
            new Order("John", 10.0m, 4.0m, new DateTime(2022, 06, 08, 12, 0, 0))
        };
    }
}