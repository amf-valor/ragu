using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ragu.Core;
using Xunit;

namespace Ragu.Tests
{
    [Collection(Fixture.Collection)]
    public class GetAllDeliveryLocaleTests
    {
        private readonly Fixture _fixture;

        public GetAllDeliveryLocaleTests(Fixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task Given_some_delivery_locales_When_get_Then_should_return_all()
        {
            var deliveryLocale1 = new DeliveryLocale("hood1", 30.0m);
            var deliveryLocale2 = new DeliveryLocale("hood2", 26.0m);
            _fixture.DbContext.Add(deliveryLocale1);
            _fixture.DbContext.Add(deliveryLocale2);
            await _fixture.DbContext.SaveChangesAsync();

            var httpClient = _fixture.CreateClient();
            var actual = await httpClient.GetAsJson<List<GetDeliveryLocaleResponse>>(RaguWebApiRoutes.DeliveryLocales);

            Assert.NotNull(actual);
            Assert.Equal(2, actual!.Count);
            Assert.Contains(actual, item => item.Id == 1);
            Assert.Contains(actual, item => item.Id == 2);
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