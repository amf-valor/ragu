using Microsoft.EntityFrameworkCore;
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
        var newProduct = new Product(name, price);
        _dbContext.Products.Add(newProduct);
        _ = await _dbContext.SaveChangesAsync();
        return newProduct;
    }

    public Task<List<Product>> GetNotDeleteds()
        => _dbContext.Products.Where(_ => !_.IsDeleted).ToListAsync();

    public async Task MarkAsDeleted(int id)
    {
        var toBeMarked = await _dbContext.Products.FindAsync(id)
            ?? throw new InvalidOperationException($"cannot find product with id:{id}");

        toBeMarked.IsDeleted = true;
        await _dbContext.SaveChangesAsync();
    }

    public Task<bool> Exists(int id) => _dbContext.Products.AnyAsync(_ => _.Id == id);
}