using Microsoft.AspNetCore.Mvc;
using Ragu.Services;

namespace Namespace;

[Route("api/orders")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult> GetBooked(DateTimeOffset ofDay)
    {
        var orders = await _orderService.GetBooked(ofDay);

        var response = orders
            .Select(order => new GetBookedResponse
            {
                CustomerName = order.CustomerName,
                BookedAt = order.BookedAt,
                Value = order.Value,
                DeliveryTax = order.DeliveryTax,
                Total = order.Total,
                IsPaid = order.IsPaid
            });

        return Ok(response);
    }

    public class GetBookedResponse
    {
        public string CustomerName { get; set; } = default!;
        public DateTimeOffset BookedAt { get; set; }
        public decimal Value { get; set; }
        public decimal DeliveryTax { get; set; }
        public decimal Total { get; set; }
        public bool IsPaid { get; set; }
    }
}