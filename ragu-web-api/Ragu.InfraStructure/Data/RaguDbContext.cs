using Microsoft.EntityFrameworkCore;
using Ragu.Core;

namespace Ragu.InfraStructure.Data
{
    public class RaguDbContext : DbContext
    {
        public DbSet<DeliveryLocale>? DeliveryLocales { get; set; }

        public RaguDbContext(DbContextOptions<RaguDbContext> options): base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeliveryLocale>(b => 
            {
                b.HasKey("_id");
                b.Property(p => p.Id).HasField("_id");
                b.Property(p => p.Hood);
                b.Property(p => p.Tax).HasPrecision(18, 2);
            });
        }
    }
}