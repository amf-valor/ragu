using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Dtos;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetCustomerTests : IAsyncLifetime
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetCustomerTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    public Task DisposeAsync() => _fixture.ResetDatabase();

    public Task InitializeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_get_all_customers()
    {
        // Given
        var customers = Mother.JohnJoanaAndBen().ToArray();
        await _fixture.GivenEntities(customers);
        // When
        var actual = await _httpClient.GetAsJsonToObject<ICollection<GetCustomerResponse>>(RaguWebApiRoutes.Customers);
        // Then
        var expected = Mother.JohnJoanaAndBenResponse(customers[0].Id, customers[1].Id, customers[2].Id);
        actual.Should().BeEquivalentTo(expected);
    }
}