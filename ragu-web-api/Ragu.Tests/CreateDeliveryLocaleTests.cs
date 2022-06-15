using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

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
        var content = CreateWithUtf8AndJson(PostDeliveryLocaleRequest.Any());

        var actualResponse = await _httpClient
            .PostAsync(RaguWebApiRoutes.DeliveryLocales, content);

        var payload = await actualResponse.Content.ReadAsStringAsync();

        using var context = _fixture.CreateDbContext();
        var actualEntity = context.DeliveryLocales
            .Find(DeserializeCamelCase<PostDeliveryLocaleResponse>(payload)?.Id);

        actualResponse.StatusCode.Should().Be(HttpStatusCode.Created);
        actualEntity.Should().NotBeNull();
        actualEntity.Should().BeEquivalentTo(PostDeliveryLocaleRequest.Any());
        actualEntity!.Id.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task Given_invalid_request_When_post_Then_should_return_bad_request()
    {
        var content = CreateWithUtf8AndJson(PostDeliveryLocaleRequest.Bad());

        var actual = await _httpClient.PostAsync(RaguWebApiRoutes.DeliveryLocales, content);

        actual.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    private static StringContent CreateWithUtf8AndJson(object @object)
    {
        var json = JsonSerializer.Serialize(@object);
        return new StringContent(json, Encoding.UTF8, MediaTypeNames.Application.Json);
    }

    private static T? DeserializeCamelCase<T>(string payload)
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

    private class PostDeliveryLocaleRequest
    {
        public string Hood { get; set; }
        public decimal Tax { get; set; }

        private PostDeliveryLocaleRequest(string hood, decimal tax)
        {
            Hood = hood;
            Tax = tax;
        }

        internal static PostDeliveryLocaleRequest Any() => new("any", 10.0m);

        internal static PostDeliveryLocaleRequest Bad() => new("", 0.0m);
    }
}