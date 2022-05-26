using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace Ragu.Tests
{
    [Collection(nameof(FixtureCollection))]
    public class CreateDeliveryLocaleTests : IAsyncLifetime
    {
        private readonly Fixture _fixture;
        private readonly HttpClient _httpClient;

        public CreateDeliveryLocaleTests(Fixture fixture)
        {
            _fixture = fixture;
            _httpClient = _fixture.CreateClient();        
        }

        [Fact]
        public async Task Given_valid_delivery_locale_When_post_Then_should_be_created()
        {
            var content = CreateWithUtf8AndJson(new { hood = "são miguel", tax = 20.00 });
            
            var actualResponse = await _httpClient.PostAsync(RaguWebApiRoutes.DeliveryLocales, content);
            string payload = await actualResponse.Content.ReadAsStringAsync();

            using(var context = _fixture.CreateDbContext())
            {
                var actualEntity = context.DeliveryLocales?.Find(DeserializeCamelCase<PostDeliveryLocaleResponse>(payload)?.Id); 

                Assert.NotNull(actualEntity);
                Assert.Equal(HttpStatusCode.Created, actualResponse.StatusCode);
                Assert.Equal("são miguel", actualEntity!.Hood);
                Assert.Equal(20.00m, actualEntity.Tax);
            }
        }

        [Fact]
        public async Task Given_invalid_request_When_post_Then_should_return_bad_request()
        {
            var content = CreateWithUtf8AndJson(new { hood = "", tax = 0 });
            
            var actual = await _httpClient.PostAsync(RaguWebApiRoutes.DeliveryLocales, content);

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

        public Task InitializeAsync() => Task.CompletedTask;

        public Task DisposeAsync() => _fixture.ResetDatabase();

        private class PostDeliveryLocaleResponse
        {
            public int Id { get; set; }
        }
    }
}