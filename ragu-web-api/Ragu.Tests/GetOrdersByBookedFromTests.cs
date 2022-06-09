using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.InfraStructure;
using Xunit;
using static Namespace.OrdersController;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetOrdersByBookedFromTests
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetOrdersByBookedFromTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_get_all_orders_When_given_valid_booked_from()
    {
        using var dateTimeContext = new DateTimeContext(new DateTime(2022, 06, 08));
        using (var dbContext = _fixture.CreateDbContext())
        {
            dbContext.Orders.Add(Mother.OrderOfJohn());
            await dbContext.SaveChangesAsync();
        }

        var today = DateOnly.FromDateTime(DateTimeProvider.Now);
        var actual = await _httpClient.GetAsJson<ICollection<GetByBookedFromResponse>>($"api/orders?bookedFrom={today}");

        var expected = new List<GetByBookedFromResponse>
        {
            Mother.GetByBookedFromResponseOfJohn()
        };

        actual.Should().NotBeNull();
        actual.Should().BeEquivalentTo(expected);
    }
}