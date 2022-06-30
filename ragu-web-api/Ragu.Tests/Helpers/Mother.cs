using System;
using System.Collections.Generic;
using Ragu.Core;
using Ragu.InfraStructure;
using Ragu.Tests.Dtos;
using static Ragu.Tests.GetBookedOrdersOfTheDayTests;

namespace Ragu.Tests.Helpers;

internal static class Mother
{
    private const string Any = "any";
    private const int AnyNumber = 123;

    internal static Order OrderOfJohn()
    {
        var order = new Order(John(), 4.0m, TodayAtMidDay());
        order.AddItem(Ragu());
        return order;
    }

    private static Address AnyAddress() =>
        new Address.Builder()
            .WithCity(Any)
            .WithNeighborhood(Any)
            .WithNumber(AnyNumber)
            .WithStreet(Any)
            .Build();



    internal static ICollection<Customer> JohnJoanaAndBen() => new List<Customer>
    {
        John(),
        Joana(),
        Ben()
    };

    internal static UpdateCustomerRequest UpdateCustomerRequest(int id)
    {
        var updated = "updated";

        return new UpdateCustomerRequest
        {
            Id = id,
            City = updated,
            Name = updated,
            Neighborhood = updated,
            PhoneNumber = 123,
            Street = updated,
            StreetNumber = 123
        };
    }

    internal static Customer UpdatedCustomer()
    {
        var address = new Address.Builder()
          .WithCity("updated")
          .WithNeighborhood("updated")
          .WithNumber(123)
          .WithStreet("updated")
          .Build();

        return new Customer("updated", address, 123);
    }

    private static Customer John() => CreateCustomer("John", AnyAddress());

    private static Customer Joana() => CreateCustomer("Joana", AnyAddress());

    public static Customer Ben()
    {
        var addressOfBen = new Address.Builder()
           .WithCity("São Paulo")
           .WithNeighborhood("São miguel")
           .WithNumber(578)
           .WithStreet("Rua ernesto evans")
           .Build();

        return CreateCustomer("Ben", addressOfBen, 12986254104);
    }

    internal static ICollection<GetCustomerResponse> JohnJoanaAndBenResponse(int idOfJohn, int idOfJoana, int idOfBen)
    {
        return new List<GetCustomerResponse>
        {
            CreateWithAnyAddress(idOfJohn, "John"),
            CreateWithAnyAddress(idOfJoana, "Joana"),
            new GetCustomerResponse
            {
                Id = idOfBen,
                Name = "Ben",
                City = "São Paulo",
                Neighborhood = "São miguel",
                PhoneNumber = 12986254104,
                Street = "Rua ernesto evans",
                StreetNumber = 578
            }
        };
    }

    private static GetCustomerResponse CreateWithAnyAddress(int id, string name) =>
        new()
        {
            Id = id,
            Name = name,
            City = Any,
            Neighborhood = Any,
            PhoneNumber = null,
            Street = Any,
            StreetNumber = AnyNumber
        };


    internal static PostProductRequest RaguRequest() => new() { Name = "Ragu", Price = 10.0m };

    private static Customer CreateCustomer(string name, Address address, long? phoneNumber = null)
        => new(name, address)
        {
            PhoneNumber = phoneNumber
        };

    internal static ICollection<Product> RaguFeijoadaAndGalinhada()
        => new List<Product>
        {
            Ragu(),
            Feijoada(),
            Galinhada()
        };


    public static Product Ragu() => new("ragu", 10.0m);

    private static Product Feijoada() => new("feijoada", 15.0m);

    private static Product Galinhada() => new("galinhada", 20.0m);

    internal static ICollection<Product> RaguAndDeletedTapioca()
        => new List<Product>
        {
            Ragu(),
            DeletedTapioca()
        };

    private static Product DeletedTapioca() => new("tapioca", 6.0m) { IsDeleted = true };

    internal static GetProductResponse RaguResponse(int id) => new()
    {
        Id = id,
        Name = "ragu",
        Price = 10.0m
    };

    private static DateTime TodayAtMidDay() => new(DateTimeContext.Now.Year,
                                                   DateTimeContext.Now.Month,
                                                   DateTimeContext.Now.Day,
                                                   12,
                                                   0,
                                                   0);


    internal static GetBookedResponse GetBookedResponseOfJohn(int orderId) => new()
    {
        Id = orderId,
        CustomerName = "John",
        BookedAt = TodayAtMidDay(),
        Subtotal = 10.0m,
        DeliveryTax = 4.0m,
        Total = 14.0m,
        IsPaid = false
    };

    internal static Order OrderOfBen()
    {
        var order = new Order(Ben(), 5.0m, new DateTime(2022, 06, 07));
        order.AddItem(Feijoada());
        order.AddItem(Ragu());
        return order;
    }


    internal static ICollection<Order> OrdersFromJohnJoanaAndBen() => new List<Order>
    {
        OrderOfJohn(),
        OrderOfJoana(),
        OrderOfBen()
    };

    internal static Order OrderOfJoana() => new(Joana(), 3.0m, new DateTime(2022, 06, 09));

    internal static PostCustomerRequest PostRequestOfJoao() => new()
    {
        Name = "João",
        City = "Ubatuba",
        Neighborhood = "Itagua",
        PhoneNumber = 12986254104,
        Street = "Rua euclides da cunha",
        StreetNumber = 55
    };
}