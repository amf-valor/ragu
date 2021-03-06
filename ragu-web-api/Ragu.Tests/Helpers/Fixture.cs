using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using DotNet.Testcontainers.Containers.Builders;
using DotNet.Testcontainers.Containers.Configurations.Databases;
using DotNet.Testcontainers.Containers.Modules.Databases;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Ragu.InfraStructure;
using Ragu.InfraStructure.Data;
using Ragu.Services;
using Xunit;

namespace Ragu.Tests.Helpers;

public sealed class Fixture : IDisposable
{
    private readonly WebApplicationFactory<Program> _applicationFactory;


    private readonly MsSqlTestcontainer _sqlTestContainer;

    public const int NonExistentId = 0;

    public Fixture()
    {
        _sqlTestContainer = Task.Run(() => CreateAndStartDockerSqlContainer()).Result;
        _applicationFactory = CreateApplicationFactory();
        using var context = CreateDbContext();
        context.Database.EnsureDeleted();
        context.Database.Migrate();
    }
    internal async Task GivenEntity<T>(T entity) where T : class
    {
        using var dbContext = CreateDbContext();
        dbContext.Set<T>().Add(entity);
        await dbContext.SaveChangesAsync();
    }

    internal async Task GivenEntities<T>(ICollection<T> entities) where T : class
    {
        using var dbContext = CreateDbContext();
        dbContext.Set<T>().AddRange(entities);
        await dbContext.SaveChangesAsync();
    }

    internal static void SetTo2022JunEight()
    {
        DateTimeContext.SetNow(() => new DateTime(2022, 06, 08));
    }

    internal RaguDbContext CreateDbContext()
    {
        var contextOptions = new DbContextOptionsBuilder<RaguDbContext>()
            .UseSqlServer(_sqlTestContainer.ConnectionString + "Encrypt=false")
            .Options;

        return new RaguDbContext(contextOptions);
    }

    public HttpClient CreateClient() => _applicationFactory.CreateClient();


    public void Dispose()
    {
        Task.Run(() => _sqlTestContainer.StopAsync()).Wait();
        Task.Run(() => _sqlTestContainer.CleanUpAsync()).Wait();
    }

    private static async Task<MsSqlTestcontainer> CreateAndStartDockerSqlContainer()
    {
        var container = new TestcontainersBuilder<MsSqlTestcontainer>()
        .WithImage("mcr.microsoft.com/mssql/server:2019-latest")
        .WithDatabase(new MsSqlTestcontainerConfiguration
        {
            Password = "@nyPwd123"
        })
        .Build();

        container.Database = "ragu";
        await container.StartAsync();
        return container;
    }

    private WebApplicationFactory<Program> CreateApplicationFactory()
    {
        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder
            (
                builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<RaguDbContext>));

                        if (descriptor is not null)
                            services.Remove(descriptor);

                        services.AddDbContext<RaguDbContext>(options =>
                        {
                            options.UseSqlServer(_sqlTestContainer.ConnectionString + "Encrypt=false");
                        });
                        services.AddScoped<DeliveryLocaleService>();
                    });
                }
            );
    }

    internal async Task ResetDatabase()
    {
        //Consider Respawn
        using var context = CreateDbContext();
        await context.Database.ExecuteSqlRawAsync
        (
            @"TRUNCATE TABLE DeliveryLocales;
              TRUNCATE TABLE OrderProduct;
              DELETE FROM Orders;
              DELETE FROM Products;
              DELETE FROM CUSTOMERS;"
        );
    }
}

[CollectionDefinition(nameof(FixtureCollection))]
public class FixtureCollection : ICollectionFixture<Fixture>
{
    // This class has no code, and is never created. Its purpose is simply
    // to be the place to apply [CollectionDefinition] and all the
    // ICollectionFixture<> interfaces
}