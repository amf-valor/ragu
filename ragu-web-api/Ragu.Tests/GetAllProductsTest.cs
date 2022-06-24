using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Tests.Dtos;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetAllProductsTest
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetAllProductsTest(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = _fixture.CreateClient();
    }

    [Fact]
    public async Task Should_get_all_products()
    {
        //Given
        var products = Mother.RaguFeijoadaAndGalinhada();
        await _fixture.GivenEntities(products);
        // When
        var actual = await _httpClient.GetAsJsonToObject<ICollection<GetProductResponse>>(RaguWebApiRoutes.Products);
        // Then
        actual.Should().BeEquivalentTo(products, _ => _.Excluding(_ => _.Orders));
    }
}