using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.InfraStructure;
using Ragu.Tests.Helpers;
using Xunit;

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
        //Given
        var orders = Mother.OrdersFromJohnJoanaAndBen();
        await _fixture.GivenEntities(orders);
        //When
        var actual = await _httpClient.GetAsJsonToObject<ICollection<GetBookedResponse>>($"api/orders?ofDay={ofDay}");

        var orderOfJohn = orders.First();
        var expected = new List<GetBookedResponse>
        {
            Mother.GetBookedResponseOfJohn(orderOfJohn.Id)
        };
        //Then
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

    internal class GetBookedResponse
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTimeOffset BookedAt { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DeliveryTax { get; set; }
        public decimal Total { get; set; }
        public bool IsPaid { get; set; }
    }
}