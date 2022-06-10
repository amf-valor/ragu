using Microsoft.EntityFrameworkCore;
using Ragu.Core;
using Ragu.InfraStructure;
using Ragu.InfraStructure.Data;

namespace Ragu.Services;
public class OrderService
{
    private readonly RaguDbContext _raguContext;

    public OrderService(RaguDbContext raguContext)
    {
        _raguContext = raguContext;
    }

    public async Task<ICollection<Order>> GetBooked(DateTimeOffset ofDay)
    {
        return await _raguContext.Orders
            .Where(order => order.BookedAt >= ofDay.AtBegin() && order.BookedAt <= ofDay.AtEnd())
            .ToListAsync();
    }
}

