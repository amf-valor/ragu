using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using DotNet.Testcontainers.Containers.Builders;
using DotNet.Testcontainers.Containers.Configurations.Databases;
using DotNet.Testcontainers.Containers.Modules.Databases;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Ragu.InfraStructure.Data;
using Ragu.Services;
using Xunit;

namespace Ragu.Tests
{
    public class Fixture : IDisposable
    {       
        internal RaguDbContext DbContext;

        private readonly WebApplicationFactory<Program> _applicationFactory;
        private readonly MsSqlTestcontainer _sqlTestContainer;
        private readonly IServiceScope _scope;

        public Fixture()
        {
            _sqlTestContainer = Task.Run(() => CreateAndStartDockerSqlContainer()).Result;
            _applicationFactory = CreateApplicationFactory()!;
            _scope = _applicationFactory.Server.Services.GetService<IServiceScopeFactory>()!.CreateScope();
            DbContext = _scope.ServiceProvider.GetService<RaguDbContext>()!;
            DbContext.Database.EnsureDeleted();
            DbContext.Database.EnsureCreated();
        }

        public HttpClient CreateClient() => _applicationFactory.CreateClient();


        public void Dispose()
        {
            Task.Run(() => _sqlTestContainer.StopAsync()).Wait();
            Task.Run(() => _sqlTestContainer.CleanUpAsync()).Wait();
            _scope.Dispose();
        }

        private async Task<MsSqlTestcontainer> CreateAndStartDockerSqlContainer()
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

        private WebApplicationFactory<Program>? CreateApplicationFactory()
        {
            return new WebApplicationFactory<Program>()
                .WithWebHostBuilder
                (
                    builder => 
                    {
                        builder.ConfigureServices(services =>
                        {
                            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<RaguDbContext>));
                            
                            if(descriptor is not null)
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
    }

    [CollectionDefinition("Fixture collection")]
    public class FixtureCollection: ICollectionFixture<Fixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces
    }
}