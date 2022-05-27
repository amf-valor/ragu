using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Ragu.Core;
using Ragu.Services;
using Xunit;

namespace Ragu.Tests;

[Collection(nameof(FixtureCollection))]
public class DeleteDeliveryLocaleTests : IAsyncLifetime
{
    private const int NON_EXISTENCE_ID = 0;
    private readonly Fixture _fixture;
    private readonly HttpClient _httpClient;

    public DeleteDeliveryLocaleTests(Fixture fixture)
    {
        _fixture = fixture;
        _httpClient = fixture.CreateClient();
    }


    [Fact]
    public async Task Should_be_ok_And_removed_from_database_When_existing_delivery_locale()
    {
        var saoMiguel = new DeliveryLocale("são miguel", 20.0m);

        using (var context = _fixture.CreateDbContext())
        {
            context.Add(saoMiguel);
            await context.SaveChangesAsync();
        }

        var response = await _httpClient
            .DeleteAsync($"{RaguWebApiRoutes.DeliveryLocales}/{saoMiguel.Id}");

        using (var context = _fixture.CreateDbContext())
        {
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            context.DeliveryLocales.Find(saoMiguel.Id).Should().BeNull();
        }
    }

    [Fact]
    public async Task Should_be_not_found_When_delivery_locale_does_not_exists()
    {
        var response = await _httpClient
            .DeleteAsync($"{RaguWebApiRoutes.DeliveryLocales}/{NON_EXISTENCE_ID}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Should_throw_InvalidOperationException_When_remove_non_existent_delivery_locale()
    {
        using var context = _fixture.CreateDbContext();
        var service = new DeliveryLocaleService(context);

        Func<Task> actual = () => service.Remove(NON_EXISTENCE_ID);

        await actual.Should().ThrowAsync<InvalidOperationException>();
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public Task DisposeAsync() => _fixture.ResetDatabase();
}