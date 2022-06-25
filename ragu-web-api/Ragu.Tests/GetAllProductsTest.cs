using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using FluentAssertions.Equivalency;
using Ragu.Core;
using Ragu.Tests.Dtos;
using Ragu.Tests.Helpers;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class GetAllProductsTest : IAsyncLifetime
{
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public GetAllProductsTest(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = _fixture.CreateClient();
    }

    public Task DisposeAsync() => _fixture.ResetDatabase();

    public Task InitializeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_get_all_products()
    {
        //Given
        var products = Mother.RaguFeijoadaAndGalinhada();
        await _fixture.GivenEntities(products);
        // When
        var actual = await _httpClient.GetAsJsonToObject<ICollection<GetProductResponse>>(RaguWebApiRoutes.Products);
        // Then
        actual.Should().BeEquivalentTo(products, ExcludeProperties);
    }

    [Fact]
    public async Task Should_exclude_deleted_products()
    {
        //Given
        var products = Mother.RaguAndDeletedTapioca();
        await _fixture.GivenEntities(products);
        // When
        var actual = await _httpClient.GetAsJsonToObject<ICollection<GetProductResponse>>(RaguWebApiRoutes.Products);
        // Then
        var expected = new List<GetProductResponse> { Mother.RaguResponse(products.First().Id) };
        actual.Should().BeEquivalentTo(expected);
    }


    private EquivalencyAssertionOptions<Product> ExcludeProperties(EquivalencyAssertionOptions<Product> options)
    {
        options.Excluding(_ => _.Orders);
        options.Excluding(_ => _.IsDeleted);
        return options;
    }
}