using Ragu.Core;
using Ragu.InfraStructure.Data;

namespace Ragu.Services;

public class CustomerService
{
    private readonly RaguDbContext _dbContext;

    public CustomerService(RaguDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Customer> Create(string name, Address home, long? phoneNumber)
    {
        var toBeAdded = new Customer(name, home, phoneNumber);
        _dbContext.Customers.Add(toBeAdded);
        _ = await _dbContext.SaveChangesAsync();
        return toBeAdded;
    }

    public Task<IEnumerable<Customer>> GetAll() => Task.FromResult(_dbContext.Customers.AsEnumerable());
}