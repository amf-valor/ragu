using System.ComponentModel.DataAnnotations;
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

        [HttpPost]
        public async Task<ActionResult<PostDeliveryLocaleResponse>> Post(PostDeliveryLocaleRequest request)
        {
            var newDeliveryLocale = await _service.Create(request.Hood, request.Tax!.Value);
            
            var response = new PostDeliveryLocaleResponse()
            {
                Id = newDeliveryLocale.Id,
                Hood = newDeliveryLocale.Hood,
                Tax = newDeliveryLocale.Tax
            };

            return Created("api/deliveryLocales", response);
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<GetDeliveryLocaleResponse>>> Get()
        {
            var deliveryLocales = await _service.GetAll();
            
            var response = deliveryLocales
                .Select(item => new GetDeliveryLocaleResponse
                {
                    Id = item.Id,
                    Hood = item.Hood,
                    Tax = item.Tax
                });

            return Ok(response);
        }
    }

    public class GetDeliveryLocaleResponse
    {
        public int Id { get; internal set; }
        public string Hood { get; internal set; } = null!;
        public decimal Tax { get; internal set; }
    }

    public class PostDeliveryLocaleResponse
    {
        public int Id { get; set; }
        public string Hood { get; set; } = null!;
        public decimal Tax { get; set; }
    }

    public class PostDeliveryLocaleRequest
    {
        [Required]
        public string Hood { get; set; } = null!;
        
        [Required]
        public decimal? Tax { get; set; }
    }
}
