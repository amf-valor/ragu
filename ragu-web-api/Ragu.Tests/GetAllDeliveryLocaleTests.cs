using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Core;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetAllDeliveryLocaleTests
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;
    public GetAllDeliveryLocaleTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Given_some_delivery_locales_When_get_Then_should_return_all()
    {
        var expected = new List<DeliveryLocale>
        {
            new DeliveryLocale("hood1", 30.0m),
            new DeliveryLocale("hood2", 26.0m)
        };

        using (var context = _fixture.CreateDbContext())
        {
            context.AddRange(expected);
            await context.SaveChangesAsync();
        }


        var actual = await _httpClient
            .GetAsJsonToObject<List<GetDeliveryLocaleResponse>>(RaguWebApiRoutes.DeliveryLocales);

        actual.Should().NotBeNull();
        actual.Should().BeEquivalentTo(expected);
    }
}

internal class GetDeliveryLocaleResponse
{
    public int Id { get; set; }
    public string Hood { get; set; } = null!;
    public decimal Tax { get; set; }
}