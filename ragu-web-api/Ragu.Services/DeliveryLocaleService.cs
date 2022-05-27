using Microsoft.EntityFrameworkCore;
using Ragu.Core;
using Ragu.InfraStructure.Data;

namespace Ragu.Services;

public class DeliveryLocaleService
{
    private readonly RaguDbContext _dbContext;

    public DeliveryLocaleService(RaguDbContext dbContext)
    {
        if (dbContext is null)
            throw new ArgumentException("dbContext cannot be null");

        _dbContext = dbContext;
    }

    public async Task<DeliveryLocale> Create(string hood, decimal tax)
    {
        var deliveryLocale = new DeliveryLocale(hood, tax);
        _dbContext.DeliveryLocales.Add(deliveryLocale);
        await _dbContext.SaveChangesAsync();
        return deliveryLocale;
    }

    public Task<List<DeliveryLocale>> GetAll() => _dbContext.DeliveryLocales.ToListAsync();

    public async Task Remove(int id)
    {
        var toBeRemoved = await _dbContext.DeliveryLocales.FindAsync(id);

        if (toBeRemoved is null)
            throw new InvalidOperationException($"cannot find any delivery locale with id: {id}");

        _dbContext.DeliveryLocales.Remove(toBeRemoved);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<bool> NotExists(int id) =>
        !await _dbContext.DeliveryLocales.AnyAsync(deliveryLocale => deliveryLocale.Id == id);
}
