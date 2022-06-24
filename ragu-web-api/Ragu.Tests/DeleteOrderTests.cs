using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class DeleteOrderTests
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public DeleteOrderTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_delete_order_when_given_id()
    {
        // Given
        var orderOfJohn = Mother.OrderOfJohn();
        await _fixture.GivenEntity(orderOfJohn);
        // When
        var actual = await _httpClient.DeleteAsync($"{RaguWebApiRoutes.Orders}/{orderOfJohn.Id}");
        // Then
        actual.Should().NotBeNull();
        actual.StatusCode.Should().Be(HttpStatusCode.OK);

        using var dbContext = _fixture.CreateDbContext();
        var actualEntity = await dbContext.Orders.FindAsync(orderOfJohn.Id);
        actualEntity.Should().BeNull();
    }

    [Fact]
    public async Task Should_return_notfound_when_given_non_existent_id()
    {
        // Given
        var nonExistentId = 0;
        // When
        var actual = await _httpClient.DeleteAsync($"{RaguWebApiRoutes.Orders}/{nonExistentId}");
        // Then
        actual.Should().NotBeNull();
        actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}