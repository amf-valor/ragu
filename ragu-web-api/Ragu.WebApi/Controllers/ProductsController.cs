using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Ragu.Services;

namespace Namespace;

[Route(ResourceUri)]
[ApiController]
public class ProductsController : ControllerBase
{
    private const string ResourceUri = "api/products";
    private readonly ProductService _productService;

    public ProductsController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task<ActionResult<PostProductResponse>> Post([FromBody] PostProductRequest request)
    {
        var newProduct = await _productService.Create(request.Name, request.Price!.Value);

        var response = new PostProductResponse
        {
            Id = newProduct.Id,
            Name = newProduct.Name,
            Price = newProduct.Price
        };

        return Created(ResourceUri, response);
    }

    public class PostProductRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public decimal? Price { get; set; }
    }

    public class PostProductResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}