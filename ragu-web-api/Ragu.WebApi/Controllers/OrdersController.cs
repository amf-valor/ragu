using Microsoft.AspNetCore.Mvc;

namespace Namespace;

[Route("api/orders")]
[ApiController]
public class OrdersController : ControllerBase
{
    [HttpGet]
    public ActionResult GetByBookedTo([FromQuery(Name = "bookedTo")]DateTime bookedTo)
    {
        return Ok(new List<GetByBookedToResponse> { new GetByBookedToResponse() });
    }

    private class GetByBookedToResponse
    {
    }
}