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
    public ActionResult GetByBookedFrom(DateTimeOffset bookedFrom)
    {
        var orders = _orderService.GetByBookedFrom(bookedFrom);

        var response = orders
            .Select(order => new GetByBookedFromResponse
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

    public class GetByBookedFromResponse
    {
        public string CustomerName { get; set; } = default!;
        public DateTimeOffset BookedAt { get; set; }
        public decimal Value { get; set; }
        public decimal DeliveryTax { get; set; }
        public decimal Total { get; set; }
        public bool IsPaid { get; set; }
    }
}