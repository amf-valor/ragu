using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetOrdersByBookedToTests
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetOrdersByBookedToTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_get_all_orders_When_given_valid_booked_to()
    {
        using var context = _fixture.CreateDbContext();
        context.Orders.Add(Mother.OrderOfJohn());
        await context.SaveChangesAsync();

        var today = DateOnly.FromDateTime(DateTime.Now);
        var actual = await _httpClient.GetAsJson<ICollection<GetByBookedToResponse>>($"api/orders?bookedTo={today}");

        actual.Should().NotBeNull();
    }

    private class GetByBookedToResponse
    {
    }
}