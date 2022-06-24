using Ragu.Core;
using Ragu.InfraStructure.Data;

namespace Ragu.Services;

public class ProductService
{
    private readonly RaguDbContext _dbContext;

    public ProductService(RaguDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Product> Create(string name, decimal price)
    {
        var product = new Product(name, price);
        _dbContext.Products.Add(product);
        _ = await _dbContext.SaveChangesAsync();
        return product;
    }
}