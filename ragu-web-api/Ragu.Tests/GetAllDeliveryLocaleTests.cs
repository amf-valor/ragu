using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Ragu.Core;
using Xunit;

namespace Ragu.Tests
{
    [Collection(nameof(FixtureCollection))]
    public class GetAllDeliveryLocaleTests
    {
        private readonly Fixture _fixture;
        private readonly HttpClient _httpClient;
        public GetAllDeliveryLocaleTests(Fixture fixture)
        {
            _fixture = fixture;
            _httpClient = fixture.CreateClient();
        }

        [Fact]
        public async Task Given_some_delivery_locales_When_get_Then_should_return_all()
        {
            using(var context = _fixture.CreateDbContext())
            {
                var deliveryLocale1 = new DeliveryLocale("hood1", 30.0m);
                var deliveryLocale2 = new DeliveryLocale("hood2", 26.0m);
                context.Add(deliveryLocale1);
                context.Add(deliveryLocale2);
                await context.SaveChangesAsync();
            }

            
            var actual = await _httpClient.GetAsJson<List<GetDeliveryLocaleResponse>>(RaguWebApiRoutes.DeliveryLocales);

            Assert.NotNull(actual);
            Assert.Equal(2, actual!.Count);
            Assert.Contains(actual, item => item.Id > 0);
            Assert.Contains(actual, item => item.Id > 0);
            Assert.Contains(actual, item => item.Hood.Equals("hood1"));
            Assert.Contains(actual, item => item.Hood.Equals("hood2"));
            Assert.Contains(actual, item => item.Tax == 30.0m);
            Assert.Contains(actual, item => item.Tax == 26.0m);
        }
    }

    internal class GetDeliveryLocaleResponse
    {
        public int Id { get; set; }
        public string Hood { get; set; } = null!;
        public decimal Tax { get; set; }
    }
}