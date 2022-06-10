using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.InfraStructure;
using Xunit;
using static Namespace.OrdersController;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetBookedOrdersOfTheDayTests
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetBookedOrdersOfTheDayTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_get_booked_orders_of_the_day()
    {
        Fixture.SetTo2022JunEight();

        using (var dbContext = _fixture.CreateDbContext())
        {
            dbContext.Orders.AddRange(Mother.OrdersFromJohnJoanaAndBen());
            await dbContext.SaveChangesAsync();
        }

        var actual = await _httpClient.GetAsJson<ICollection<GetBookedResponse>>($"api/orders?ofDay={DateTimeContext.Now}");

        var expected = new List<GetBookedResponse>
        {
            Mother.GetBookedResponseOfJohn()
        };

        actual.Should().NotBeNull();
        actual.Should().BeEquivalentTo(expected);
    }
}