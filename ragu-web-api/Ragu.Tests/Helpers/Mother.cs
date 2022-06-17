using System;
using System.Collections.Generic;
using Ragu.Core;
using Ragu.InfraStructure;
using static Ragu.Tests.GetBookedOrdersOfTheDayTests;

namespace Ragu.Tests.Helpers;

internal static class Mother
{
    public static Order OrderOfJohn()
    {
        var order = new Order("John", 4.0m, TodayAtMidDay());
        order.AddItem(Ragu());
        return order;
    }
    private static Product Ragu()
    {
        return new Product("ragu", 10.0m);
    }

    private static DateTime TodayAtMidDay()
    {
        return new DateTime(DateTimeContext.Now.Year,
                            DateTimeContext.Now.Month,
                            DateTimeContext.Now.Day,
                            12,
                            0,
                            0);
    }

    internal static GetBookedResponse GetBookedResponseOfJohn(int orderId)
    {
        return new GetBookedResponse
        {
            Id = orderId,
            CustomerName = "John",
            BookedAt = TodayAtMidDay(),
            SubTotal = 10.0m,
            DeliveryTax = 4.0m,
            Total = 14.0m,
            IsPaid = false
        };
    }

    internal static Order OrderOfBen()
    {
        var order = new Order("Ben", 5.0m, new DateTime(2022, 06, 07));
        var feijoada = new Product("feijoada", 15.0m);
        order.AddItem(feijoada);
        order.AddItem(Ragu());
        return order;
    }


    internal static ICollection<Order> OrdersFromJohnJoanaAndBen()
    {
        return new List<Order>
        {
            OrderOfJohn(),
            OrderOfJoana(),
            OrderOfBen()
        };
    }

    internal static Order OrderOfJoana()
    {
        return new Order("Joana", 3.0m, new DateTime(2022, 06, 09));
    }

}