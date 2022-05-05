using Ragu.Core;

namespace Ragu.Services
{
    public class DeliveryLocaleService
    {
        public DeliveryLocale Create(string hood, decimal tax)
        {
            return new DeliveryLocale(1, hood, tax);
        }
    }
}