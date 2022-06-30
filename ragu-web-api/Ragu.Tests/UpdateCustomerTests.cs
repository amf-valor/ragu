using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class UpdateCustomerTests : IAsyncLifetime
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public UpdateCustomerTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    public Task DisposeAsync() => _fixture.ResetDatabase();

    public Task InitializeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_put_when_valid_id_and_customer_is_given()
    {
        // Given
        var ben = Mother.Ben();
        await _fixture.GivenEntity(ben);
        // When
        var response = await _httpClient.PutAsJson($"{RaguWebApiRoutes.Customers}/{ben.Id}", Mother.UpdateCustomerRequest(ben.Id));
        using var dbContext = _fixture.CreateDbContext();
        var actual = await dbContext.Customers.FindAsync(ben.Id);
        var expected = Mother.UpdatedCustomer();
        // Then
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        actual.Should().BeEquivalentTo(expected, _ => _.Excluding(_ => _.Id));
    }

    [Theory]
    [MemberData(nameof(ShouldReturnBadRequestWhenGivenRequestIsInvalid))]
    public async Task Should_return_bad_request_when_given_request_is_invalid(int customerId, UpdateCustomerRequest payload)
    {
        //When
        var actual = await _httpClient.PutAsJson($"{RaguWebApiRoutes.Customers}/{customerId}", payload);
        //Then
        actual.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Should_return_not_found_when_non_existent_id_is_given()
    {
        //Given
        var requestWithNonExistentId = Mother.UpdateCustomerRequest(Fixture.NonExistentId);
        // When
        var actual = await _httpClient.PutAsJson($"{RaguWebApiRoutes.Customers}/{Fixture.NonExistentId}", requestWithNonExistentId);
        // Then
        actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    public static IEnumerable<object[]> ShouldReturnBadRequestWhenGivenRequestIsInvalid()
    {
        yield return new object[]
        {
            1,
            new UpdateCustomerRequest { Id = 2 }
        };

        yield return new object[]
        {
            1,
            new UpdateCustomerRequest
            {
                Id = 1,
                Name = string.Empty,
                City = string.Empty,
                Neighborhood =  string.Empty,
                Street = string.Empty,
            }
        };
    }
}