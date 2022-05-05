using Microsoft.AspNetCore.Mvc;

namespace Ragu.WebApi.Controllers
{
    [Route("api/deliveryLocales")]
    [ApiController]
    public class DeliveryLocalesController : ControllerBase
    {
        public ActionResult<PostDeliveryLocaleResponse> Post(PostDeliveryLocaleRequest request)
        {
            return Created("api/deliveryLocales", new PostDeliveryLocaleResponse());
        }
    }

    public class PostDeliveryLocaleResponse
    {
    }

    public class PostDeliveryLocaleRequest
    {
    }
}
