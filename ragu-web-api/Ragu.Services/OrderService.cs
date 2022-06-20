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
            .Include(_ => _.Products)
            .Where(order => order.BookedAt >= ofDay.AtBegin() && order.BookedAt <= ofDay.AtEnd())
            .ToListAsync();
    }

    public Task<Order?> GetDetails(int id)
    {
        return _raguContext.Orders
            .Include(_ => _.Products).Where(_ => _.Id == id)
            .FirstOrDefaultAsync();
    }
}

