using System;
using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
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
    public class CreateDeliveryLocaleTests : IDisposable
    {
        private readonly MsSqlTestcontainer _sqlTestContainer;
        private readonly WebApplicationFactory<Program> _applicationFactory;

        public CreateDeliveryLocaleTests()
        {
            _sqlTestContainer = Task.Run(() => CreateAndStartDockerSqlContainer()).Result;
            _applicationFactory = CreateApplicationFactory()!;
        }

        [Fact]
        public async Task Given_valid_delivery_locale_When_post_Then_should_be_created()
        {
            var content = CreateWithUtf8AndJson(new { hood = "são miguel", tax = 20.00 });
            var httpClient = _applicationFactory.CreateClient();
            var serviceFactory = _applicationFactory.Server.Services.GetService<IServiceScopeFactory>();

            using(var scope = serviceFactory?.CreateScope())
            {
                RaguDbContext? dbContext = scope?.ServiceProvider.GetService<RaguDbContext>();
                dbContext?.Database.EnsureDeleted();
                dbContext?.Database.EnsureCreated();
                dbContext?.Database.Migrate();
                
                var actualResponse = await httpClient.PostAsync("api/deliveryLocales", content);
                string payload = await actualResponse.Content.ReadAsStringAsync();
                var actualEntity = dbContext?.DeliveryLocales?.Find(DeserializeCamelCase<PostDeliveryLocaleResponse>(payload)?.Id); 

                Assert.Equal(HttpStatusCode.Created, actualResponse.StatusCode);
                Assert.Equal("são miguel", actualEntity?.Hood);
                Assert.Equal(20.00m, actualEntity?.Tax);
            }   
        }

        [Fact]
        public async Task Given_invalid_request_When_post_Then_should_return_bad_request()
        {
            var content = CreateWithUtf8AndJson(new { hood = "", tax = 0 });
            var httpClient = _applicationFactory.CreateClient();

            var actual = await httpClient.PostAsync("api/deliveryLocales", content);

            Assert.Equal(HttpStatusCode.BadRequest, actual.StatusCode);
        }

        private StringContent CreateWithUtf8AndJson(object @object)
        {
            var json = JsonSerializer.Serialize(@object);
            return new StringContent(json, Encoding.UTF8, MediaTypeNames.Application.Json);
        }

        private T? DeserializeCamelCase<T>(string payload)
        {
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            return JsonSerializer.Deserialize<T>(payload, serializeOptions);
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
                            
                            services.AddDbContext<RaguDbContext>(options => 
                            {
                                options.UseSqlServer(_sqlTestContainer.ConnectionString + "Encrypt=false");    
                            });        
                            services.AddScoped<DeliveryLocaleService>();
                        });
                    }
                );
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

        public void Dispose()
        {
            Task.Run(() => _sqlTestContainer.StopAsync()).Wait();
            Task.Run(() => _sqlTestContainer.CleanUpAsync()).Wait(); 
        }

        private class PostDeliveryLocaleResponse
        {
            public int Id { get; set; }
        }


    }
}