using Microsoft.EntityFrameworkCore;
using Ragu.Core;

namespace Ragu.InfraStructure.Data;

public class RaguDbContext : DbContext
{
    public DbSet<DeliveryLocale> DeliveryLocales => Set<DeliveryLocale>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Customer> Customers => Set<Customer>();

    public RaguDbContext(DbContextOptions<RaguDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var defaultPrecision = 18;
        var defaultScale = 2;

        modelBuilder.Entity<DeliveryLocale>(b =>
        {
            b.Property(p => p.Id).HasField("_id");
            b.Property(p => p.Hood).HasField("_hood");
            b.Property(p => p.Tax).HasPrecision(defaultPrecision, defaultScale).HasField("_tax");
        });

        modelBuilder.Entity<Order>(b =>
        {
            b.Property(p => p.Id).HasField("_id");
            b.Property(p => p.BookedAt);
            b.Property(p => p.DeliveryTax).HasPrecision(defaultPrecision, defaultScale);
            b.Property(p => p.IsPaid);
        });

        modelBuilder.Entity<Product>(b =>
        {
            b.Property(p => p.Id).HasField("_id");
            b.Property(p => p.Name);
            b.Property(p => p.Price).HasPrecision(defaultPrecision, defaultScale);
        });

        modelBuilder.Entity<Customer>(b =>
        {
            b.Property(p => p.Id);
        });
    }
}
