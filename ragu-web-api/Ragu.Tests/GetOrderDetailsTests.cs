using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Helpers;
using Xunit;
using static Namespace.OrdersController;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetOrderDetailsTests
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetOrderDetailsTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_get_order_details_when_id_is_given()
    {
        // Given
        var orderOfBen = Mother.OrderOfBen();
        await _fixture.GivenEntity(orderOfBen);
        // When
        var actual = await _httpClient.GetAsJsonToObject<GetOrderDetailsResponse>($"{RaguWebApiRoutes.Orders}/{orderOfBen.Id}");
        // Then
        actual.Should().NotBeNull();
        actual!.Products.Should().BeEquivalentTo(orderOfBen.Products, _ => _.Excluding(_ => _.Orders));
    }

    [Fact]
    public async Task Should_return_not_found_when_id_non_exists()
    {
        //Given
        var nonExistentId = 0;
        //When
        var actual = await _httpClient.GetAsJson($"{RaguWebApiRoutes.Orders}/{nonExistentId}");
        //Then
        actual.Should().NotBeNull();
        actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}