using Microsoft.AspNetCore.Mvc;
using Ragu.Services;

namespace Ragu.WebApi.Controllers
{
    [Route("api/deliveryLocales")]
    [ApiController]
    public class DeliveryLocalesController : ControllerBase
    {
        private readonly DeliveryLocaleService _service;

        public DeliveryLocalesController(DeliveryLocaleService service)
        {
            _service = service;
        }

        public async Task<ActionResult<PostDeliveryLocaleResponse>> Post(PostDeliveryLocaleRequest request)
        {
            var newDeliveryLocale = await _service.Create(request.Hood, request.Tax);
            
            var response = new PostDeliveryLocaleResponse()
            {
                Id = newDeliveryLocale.Id,
                Hood = newDeliveryLocale.Hood,
                Tax = newDeliveryLocale.Tax
            };

            return Created("api/deliveryLocales", response);
        }
    }

    public class PostDeliveryLocaleResponse
    {
        public int Id { get; set; }
        public string Hood { get; set; }
        public decimal Tax { get; set; }
    }

    public class PostDeliveryLocaleRequest
    {
        public string Hood { get; set; }
        public decimal Tax { get; set; }
    }
}
