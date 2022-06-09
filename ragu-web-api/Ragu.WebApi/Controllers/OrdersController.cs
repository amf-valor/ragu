using Microsoft.AspNetCore.Mvc;

namespace Namespace;

[Route("api/orders")]
[ApiController]
public class OrdersController : ControllerBase
{
    [HttpGet]
    public ActionResult GetByBookedFrom(string bookedFrom)
    {
        return Ok(new List<GetByBookedFromResponse> { new GetByBookedFromResponse() });
    }

    public class GetByBookedFromResponse
    {
        public string CustomerName { get; set; } = default!;
        public DateTime BookedAt { get; set; }
    }
}