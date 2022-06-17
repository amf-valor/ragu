using Microsoft.AspNetCore.Mvc;
using Ragu.Core;
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
    public async Task<ActionResult<GetBookedResponse>> GetBooked(DateTimeOffset ofDay)
    {
        var orders = await _orderService.GetBooked(ofDay);

        var response = orders
            .Select(order => new GetBookedResponse
            {
                Id = order.Id,
                CustomerName = order.CustomerName,
                BookedAt = order.BookedAt,
                SubTotal = order.SubTotal,
                DeliveryTax = order.DeliveryTax,
                Total = order.Total,
                IsPaid = order.IsPaid
            });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetOrderDetailsResponse>> GetOrderDetails(int id)
    {
        var order = await _orderService.GetById(id);

        if (order is null)
        {
            return NotFound();
        }

        return Ok(MapFrom(order));
    }

    private static GetOrderDetailsResponse MapFrom(Order order)
    {
        return new GetOrderDetailsResponse
        {
            Products = order.Products.Select(_ => new GetOrderDetailsResponse.ProductResponse
            {
                Id = _.Id,
                Name = _.Name,
                Price = _.Price
            }).ToList()
        };
    }

    public class GetBookedResponse
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTimeOffset BookedAt { get; set; }
        public decimal SubTotal { get; set; }
        public decimal DeliveryTax { get; set; }
        public decimal Total { get; set; }
        public bool IsPaid { get; set; }
    }

    public class GetOrderDetailsResponse
    {
        public class ProductResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public decimal Price { get; set; }
        }
        public ICollection<ProductResponse> Products { get; set; } = new List<ProductResponse>();
    }
}