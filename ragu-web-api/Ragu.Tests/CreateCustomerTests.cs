using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Core;
using Ragu.Tests.Dtos;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class CreateCustomerTests : IAsyncLifetime
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public CreateCustomerTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    public Task DisposeAsync() => _fixture.ResetDatabase();

    public Task InitializeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_post_when_valid_customer_is_given()
    {
        // Given
        var postRequestOfJoao = Mother.PostRequestOfJoao();
        // When
        var actual = await _httpClient.PostAsJsonToObject<PostCustomerResponse>(RaguWebApiRoutes.Customers, postRequestOfJoao);
        using var dbContext = _fixture.CreateDbContext();
        var expected = await dbContext.Customers.FindAsync(actual!.Id);
        // Then
        ThenResponseShouldBeCustomer(actual, expected!);
    }

    private static void ThenResponseShouldBeCustomer(PostCustomerResponse actual, Customer expected)
    {
        actual.Id.Should().Be(expected.Id);
        actual.Name.Should().Be(expected.Name);
        actual.City.Should().Be(expected.Home.City);
        actual.Neighborhood.Should().Be(expected.Home.Neighborhood);
        actual.PhoneNumber.Should().Be(expected.PhoneNumber);
        actual.Street.Should().Be(expected.Home.Street);
        actual.StreetNumber.Should().Be(expected.Home.StreetNumber);
    }

    [Theory]
    [MemberData(nameof(ShouldReturnBadRequestWhenPostWithInvalidCustomer))]
    public async Task Should_return_bad_request_when_post_with_invalid_customer(object request)
    {
        //When
        var actual = await _httpClient.PostAsJson(RaguWebApiRoutes.Customers, request);
        //Then
        actual.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    private static IEnumerable<object[]> ShouldReturnBadRequestWhenPostWithInvalidCustomer()
    {
        yield return new object[]
        {
            new
            {
                Name = "",
                City = "",
                Neighborhood = "",
                Street = ""
            }
        };

        yield return new object[]
        {
            new
            {
                Name = "alan",
                City = "ubatuba",
                Neighborhood = "itagua",
                Street = "rua euclides da cunha"
            }
        };
    }
}