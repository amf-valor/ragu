using System;
using System.Collections.Generic;
using Ragu.Core;
using Ragu.InfraStructure;
using static Namespace.OrdersController;

namespace Ragu.Tests.Helpers;

internal static class Mother
{
    public static Order OrderOfJohn()
    {
        return new Order("John", 4.0m, TodayAtMidDay());
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

    internal static GetBookedResponse GetBookedResponseOfJohn()
    {
        return new GetBookedResponse
        {
            CustomerName = "John",
            BookedAt = TodayAtMidDay(),
            SubTotal = 0m,
            DeliveryTax = 4.0m,
            Total = 4.0m,
            IsPaid = false
        };
    }

    internal static Order OrderOfBen()
    {
        var order = new Order("Ben", 5.0m, new DateTime(2022, 06, 07));
        var feijoada = new Product("feijoada", 15.0m);
        var ragu = new Product("ragu", 10.0m);
        order.AddItem(feijoada);
        order.AddItem(ragu);
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