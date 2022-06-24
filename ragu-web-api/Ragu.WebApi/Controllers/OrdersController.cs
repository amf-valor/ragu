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
                CustomerName = order.Owner.Name,
                BookedAt = order.BookedAt,
                Subtotal = order.Subtotal,
                DeliveryTax = order.DeliveryTax,
                Total = order.Total,
                IsPaid = order.IsPaid
            });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetOrderDetailsResponse>> GetOrderDetails(int id)
    {
        var order = await _orderService.GetDetails(id);

        if (order is null)
        {
            return NotFound();
        }

        return Ok(MapFrom(order));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        if (!await _orderService.Exists(id))
        {
            return NotFound();
        }

        await _orderService.Delete(id);
        return Ok();
    }

    private static GetOrderDetailsResponse MapFrom(Order order)
    {
        return new GetOrderDetailsResponse
        {
            Id = order.Id,
            BookedAt = order.BookedAt,
            Subtotal = order.Subtotal,
            DeliveryTax = order.DeliveryTax,
            IsPaid = order.IsPaid,
            Total = order.Total,
            Customer = new GetOrderDetailsResponse.CustomerResponse
            {
                Id = order.Owner.Id,
                Name = order.Owner.Name,
                PhoneNumber = order.Owner.PhoneNumber,
                Street = order.Owner.Street,
                StreetNumber = order.Owner.StreetNumber,
                Neighborhood = order.Owner.Neighborhood,
                City = order.Owner.City
            },
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
        public decimal Subtotal { get; set; }
        public decimal DeliveryTax { get; set; }
        public decimal Total { get; set; }
        public bool IsPaid { get; set; }
    }

    public class GetOrderDetailsResponse
    {
        public int Id { get; set; }
        public ICollection<ProductResponse> Products { get; set; } = new List<ProductResponse>();
        public DateTimeOffset BookedAt { get; set; }
        public CustomerResponse Customer { get; set; } = new CustomerResponse();
        public decimal Subtotal { get; set; }
        public decimal DeliveryTax { get; set; }
        public bool IsPaid { get; set; }
        public decimal Total { get; internal set; }

        public class ProductResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public decimal Price { get; set; }
        }

        public class CustomerResponse
        {
            public int Id { get; set; }
            public string Name { get; set; } = string.Empty;
            public long? PhoneNumber { get; set; }
            public string Street { get; set; } = string.Empty;
            public int StreetNumber { get; set; }
            public string Neighborhood { get; set; } = string.Empty;
            public string City { get; set; } = string.Empty;
        }
    }
}