using Ragu.Core;
using Ragu.InfraStructure.Data;

namespace Ragu.Services;

public class UpdateCustomerCommand
{
    private readonly RaguDbContext _raguDbContext;
    private Customer? _toUpdate;
    private bool _initialized;

    public UpdateCustomerCommand(RaguDbContext raguDbContext)
    {
        _raguDbContext = raguDbContext;
    }

    public async Task Init(int customerId)
    {
        _toUpdate = await _raguDbContext.Customers.FindAsync(customerId)
            ?? throw new InvalidOperationException($"cannot find customer with id:{customerId}");

        _initialized = true;
    }

    public UpdateCustomerCommand SetName(string newName)
    {
        ThrowIfCommandNotInitialized();
        _toUpdate!.Name = newName;
        return this;
    }

    private void ThrowIfCommandNotInitialized()
    {
        if (!_initialized)
            throw new InvalidOperationException("command must be initialized before any change");
    }

    public UpdateCustomerCommand SetHomeAddress(Address newHomeAddress)
    {
        ThrowIfCommandNotInitialized();
        _toUpdate!.Home = newHomeAddress;
        return this;
    }

    public UpdateCustomerCommand SetPhoneNumber(long? newPhoneNumber)
    {
        ThrowIfCommandNotInitialized();
        _toUpdate!.PhoneNumber = newPhoneNumber;
        return this;
    }

    public async Task Execute()
    {
        ThrowIfCommandNotInitialized();
        _ = _raguDbContext.Update(_toUpdate!);
        _ = await _raguDbContext.SaveChangesAsync();
    }
}