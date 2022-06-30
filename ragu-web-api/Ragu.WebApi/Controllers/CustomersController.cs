using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Ragu.Core;
using Ragu.Services;

namespace Namespace;

[Route("api/customers")]
[ApiController]
public class CustomersController : ControllerBase
{
    private readonly CustomerService _customerService;

    public CustomersController(CustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost]
    public async Task<ActionResult<PostCustomerResponse>> Post([FromBody] PostCustomerRequest request)
    {
        var address = new Address.Builder()
            .WithCity(request.City)
            .WithNeighborhood(request.Neighborhood)
            .WithNumber(request.StreetNumber!.Value)
            .WithStreet(request.Street)
            .Build();

        var newCustomer = await _customerService.Create(request.Name, address, request.PhoneNumber);

        var response = new PostCustomerResponse
        {
            Id = newCustomer.Id,
            Name = newCustomer.Name,
            City = newCustomer.Home.City,
            Neighborhood = newCustomer.Home.Neighborhood,
            PhoneNumber = newCustomer.PhoneNumber,
            Street = newCustomer.Home.Street,
            StreetNumber = newCustomer.Home.StreetNumber
        };

        return Created("/api/customers", response);
    }

    [HttpGet]
    public async Task<ActionResult<ICollection<GetCustomerResponse>>> Get()
    {
        var allCustomers = await _customerService.GetAll();

        var response = allCustomers.Select(customer => new GetCustomerResponse
        {
            Id = customer.Id,
            Name = customer.Name,
            City = customer.Home.City,
            Neighborhood = customer.Home.Neighborhood,
            Street = customer.Home.Street,
            PhoneNumber = customer.PhoneNumber,
            StreetNumber = customer.Home.StreetNumber
        });

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, [FromBody] UpdateCustomerRequest request, [FromServices] UpdateCustomerCommand command)
    {
        if (id != request.Id)
        {
            return BadRequest($"path id: {id} does not match payload id:{request.Id}");
        }

        if (!await _customerService.Exists(id))
        {
            return NotFound();
        }

        await command.Init(id);

        await command
            .SetName(request.Name)
            .SetHomeAddress(FromRequest(request))
            .SetPhoneNumber(request.PhoneNumber)
            .Execute();

        return NoContent();
    }

    private static Address FromRequest(IAddressResquest request)
    {
        return new Address.Builder()
            .WithCity(request.City)
            .WithNeighborhood(request.Neighborhood)
            .WithNumber(request.StreetNumber)
            .WithStreet(request.Street)
            .Build();
    }

    public class PostCustomerRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public long? PhoneNumber { get; set; }
        [Required]
        public string Street { get; set; } = string.Empty;
        [Required]
        public int? StreetNumber { get; set; }
        [Required]
        public string Neighborhood { get; set; } = string.Empty;
        [Required]
        public string City { get; set; } = string.Empty;
    }

    public class PostCustomerResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public long? PhoneNumber { get; set; }
        public string Street { get; set; } = string.Empty;
        public int StreetNumber { get; set; }
        public string Neighborhood { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
    }

    public class GetCustomerResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public long? PhoneNumber { get; set; }
        public string Street { get; set; } = string.Empty;
        public int StreetNumber { get; set; }
        public string Neighborhood { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
    }

    public class UpdateCustomerRequest : IAddressResquest
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public long? PhoneNumber { get; set; }

        [Required]
        public string Street { get; set; } = string.Empty;

        public int StreetNumber { get; set; }

        [Required]
        public string Neighborhood { get; set; } = string.Empty;

        [Required]
        public string City { get; set; } = string.Empty;
    }

    public interface IAddressResquest
    {
        public string Street { get; set; }
        public int StreetNumber { get; set; }
        public string Neighborhood { get; set; }
        public string City { get; set; }
    }
}

