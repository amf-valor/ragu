using Microsoft.EntityFrameworkCore;
using Ragu.Core;

namespace Ragu.InfraStructure.Data;

public class RaguDbContext : DbContext
{
    public DbSet<DeliveryLocale> DeliveryLocales => Set<DeliveryLocale>();

    public RaguDbContext(DbContextOptions<RaguDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DeliveryLocale>(b =>
        {
            b.Property(p => p.Id).HasField("_id");
            b.Property(p => p.Hood).HasField("_hood");
            b.Property(p => p.Tax).HasPrecision(18, 2).HasField("_tax");
        });
    }
}
