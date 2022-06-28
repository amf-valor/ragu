using System;
using System.Collections.Generic;
using Ragu.Core;
using Ragu.InfraStructure;
using Ragu.Tests.Dtos;
using static Ragu.Tests.GetBookedOrdersOfTheDayTests;

namespace Ragu.Tests.Helpers;

internal static class Mother
{
    internal static Order OrderOfJohn()
    {
        var order = new Order(CreateCustomer("John", AnyAddress()), 4.0m, TodayAtMidDay());
        order.AddItem(Ragu());
        return order;
    }

    private static Address AnyAddress()
    {
        var any = "any";

        return new Address.Builder()
            .WithCity(any)
            .WithNeighborhood(any)
            .WithNumber(123)
            .WithStreet(any)
            .Build();

    }

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
        var addressOfBen = new Address.Builder()
            .WithCity("São paulo")
            .WithNeighborhood("São miguel")
            .WithNumber(578)
            .WithStreet("Rua ernesto evans")
            .Build();

        var ben = CreateCustomer("Ben", addressOfBen, 12986254104);
        var order = new Order(ben, 5.0m, new DateTime(2022, 06, 07));
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

    internal static Order OrderOfJoana() => new(CreateCustomer("Joana", AnyAddress()), 3.0m, new DateTime(2022, 06, 09));

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