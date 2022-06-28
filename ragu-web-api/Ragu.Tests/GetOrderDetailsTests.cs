using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public sealed class GetOrderDetailsTests : IAsyncLifetime
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetOrderDetailsTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }

    [Fact]
    public async Task Should_get_order_details_when_id_is_given()
    {
        // Given
        var orderOfBen = Mother.OrderOfBen();
        await _fixture.GivenEntity(orderOfBen);
        // When
        var actual = await _httpClient.GetAsJsonToObject<GetOrderDetailsResponse>($"{RaguWebApiRoutes.Orders}/{orderOfBen.Id}");
        // Then
        actual.Should().NotBeNull();

        actual.Should().BeEquivalentTo
        (
            orderOfBen, _ => _.Excluding(_ => _.Products)
                              .Excluding(_ => _.Owner)
        );

        actual!.Products.Should().BeEquivalentTo(orderOfBen.Products, ExcludingProperties.ExcludeProductProperties);
        actual.Customer.Should().BeEquivalentTo(orderOfBen.Owner, _ => _.Excluding(_ => _.Home));
    }

    [Fact]
    public async Task Should_return_not_found_when_id_non_exists()
    {
        //Given
        var nonExistentId = 0;
        //When
        var actual = await _httpClient.GetAsJson($"{RaguWebApiRoutes.Orders}/{nonExistentId}");
        //Then
        actual.Should().NotBeNull();
        actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    public Task DisposeAsync() => _fixture.ResetDatabase();

    public Task InitializeAsync() => Task.CompletedTask;

    internal class GetOrderDetailsResponse
    {
        public int Id { get; set; }
        public ICollection<ProductResponse> Products { get; set; } = new List<ProductResponse>();
        public DateTimeOffset BookedAt { get; set; }
        public CustomerResponse Customer { get; set; } = new CustomerResponse();
        public decimal Subtotal { get; set; }
        public decimal DeliveryTax { get; set; }
        public bool IsPaid { get; set; }
        public decimal Total { get; set; }

        internal class ProductResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public decimal Price { get; set; }
        }

        internal class CustomerResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public long? PhoneNumber { get; set; }
            public string Street { get; set; } = string.Empty;
            public int StreetNumber { get; set; }
            public string Neighborhood { get; set; } = string.Empty;
            public string City { get; set; } = string.Empty;
        }
    }
}