using Microsoft.EntityFrameworkCore;
using Ragu.Core;
using Ragu.InfraStructure.Data;

namespace Ragu.Services
{
    public class DeliveryLocaleService
    {
        private readonly RaguDbContext _dbContext;

        public DeliveryLocaleService(RaguDbContext dbContext)
        {
            if(dbContext is null)
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
    }
}