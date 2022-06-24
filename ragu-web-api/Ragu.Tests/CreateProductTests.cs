using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Dtos;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class CreateProductTests : IAsyncLifetime
{
    private readonly HttpClient _httpClient;
    private readonly Fixture _fixture;

    public CreateProductTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_create_when_given_valid_request()
    {
        // Given
        var raguRequest = Mother.RaguRequest();
        // When
        var actual = await _httpClient.PostAsJsonToObject<PostProductResponse>(RaguWebApiRoutes.Products, raguRequest);
        // Then
        actual.Should().NotBeNull();
        actual.Should().BeEquivalentTo(raguRequest);

        using var dbContext = _fixture.CreateDbContext();
        var actualEntity = dbContext.Products.FindAsync(actual!.Id);
        actualEntity.Should().NotBeNull();
    }

    [Theory]
    [MemberData(nameof(ShouldReturnBadRequestTestCases))]
    public async Task Should_return_bad_request_when_request_is_not_valid(object invalidRequest)
    {
        // When
        var actual = await _httpClient.PostAsJson(RaguWebApiRoutes.Products, invalidRequest);
        // Then
        actual.Should().NotBeNull();
        actual.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    private static IEnumerable<object[]> ShouldReturnBadRequestTestCases()
    {
        yield return new object[]
        {
            new
            {
                Name = "",
                Price = 10.0m
            }
        };

        yield return new object[]
        {
            new
            {
                Name = "ragu"
            }
        };

        yield return new object[]
        {
            new
            {
                Price = 10.0m
            }
        };
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public Task DisposeAsync() => _fixture.ResetDatabase();
}