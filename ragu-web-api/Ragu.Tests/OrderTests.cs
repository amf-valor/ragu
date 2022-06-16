using FluentAssertions;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

public class OrderTests
{
    [Fact]
    public void Should_return_sum_of_product_prices()
    {
        // Given
        var orderOfBen = Mother.OrderOfBen();
        var expectedSumOfProductPrices = 25.0m;
        // When
        var actual = orderOfBen.SubTotal;
        // Then
        actual.Should().Be(expectedSumOfProductPrices);
    }
}