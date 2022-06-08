using Microsoft.EntityFrameworkCore;
using Ragu.Core;

namespace Ragu.InfraStructure.Data;

public class RaguDbContext : DbContext
{
    public DbSet<DeliveryLocale> DeliveryLocales => Set<DeliveryLocale>();

    public DbSet<Order> Orders => Set<Order>();

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
            b.Property(p => p.BookedTo);
            b.Property(p => p.CustomerName);
            b.Property(p => p.DeliveryTax).HasPrecision(defaultPrecision, defaultScale);
            b.Property(p => p.IsPaid);
            b.Property(p => p.Value).HasPrecision(defaultPrecision, defaultScale);
        });
    }
}
