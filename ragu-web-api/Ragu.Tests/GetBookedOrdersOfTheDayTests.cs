using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.InfraStructure;
using Ragu.Tests.Helpers;
using Xunit;
using static Namespace.OrdersController;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public sealed class GetBookedOrdersOfTheDayTests : IAsyncLifetime, IDisposable
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    static GetBookedOrdersOfTheDayTests()
    {
        Fixture.SetTo2022JunEight();
    }
    public GetBookedOrdersOfTheDayTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
        Fixture.SetTo2022JunEight();
    }

    [Theory]
    [MemberData(nameof(ShouldGetBookedOrdersOfTheDayCases))]
    public async Task Should_get_booked_orders_of_the_day(DateTime ofDay)
    {
        using (var dbContext = _fixture.CreateDbContext())
        {
            dbContext.Orders.AddRange(Mother.OrdersFromJohnJoanaAndBen());
            await dbContext.SaveChangesAsync();
        }

        var actual = await _httpClient.GetAsJsonToObject<ICollection<GetBookedResponse>>($"api/orders?ofDay={ofDay}");

        var expected = new List<GetBookedResponse>
        {
            Mother.GetBookedResponseOfJohn()
        };

        actual.Should().NotBeNull();
        actual.Should().BeEquivalentTo(expected);
    }

    private static IEnumerable<object[]> ShouldGetBookedOrdersOfTheDayCases()
    {
        yield return new object[]
        {
            DateTimeContext.Now
        };

        const int ToPassOrderOfJohnBookedAt = 13;
        yield return new object[]
        {
            DateTimeContext.Now.AddHours(ToPassOrderOfJohnBookedAt)
        };
    }

    public Task InitializeAsync() => Task.CompletedTask;
    public Task DisposeAsync() => _fixture.ResetDatabase();

    public void Dispose() => DateTimeContext.Reset();
}