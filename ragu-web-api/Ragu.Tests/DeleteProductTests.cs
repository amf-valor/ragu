using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class DeleteProductTests
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public DeleteProductTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_delete_product_when_id_is_given()
    {
        // Given
        var ragu = Mother.Ragu();
        await _fixture.GivenEntity(ragu);
        // When
        var actual = await _httpClient.DeleteAsync($"{RaguWebApiRoutes.Products}/{ragu.Id}");
        // Then
        actual.StatusCode.Should().Be(HttpStatusCode.OK);

        using var dbContext = _fixture.CreateDbContext();
        var actualEntity = await dbContext.Products.FindAsync(ragu.Id);
        actualEntity!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task Should_return_not_found_when_non_existent_id_is_given()
    {
        // When
        var actual = await _httpClient.DeleteAsync($"{RaguWebApiRoutes.Products}/{Fixture.NonExistentId}");
        // Then
        actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}