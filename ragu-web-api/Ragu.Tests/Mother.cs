using System;
using System.Collections.Generic;
using Ragu.Core;
using Ragu.InfraStructure;
using static Namespace.OrdersController;

namespace Ragu.Tests;

internal static class Mother
{
    public static Order OrderOfJohn()
    {
        return new Order("John", 10.0m, 4.0m, TodayAtMidDay());
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
            Value = 10.0m,
            DeliveryTax = 4.0m,
            Total = 14.0m,
            IsPaid = false
        };
    }

    internal static Order OrderOfBen()
    {
        return new Order("Ben", 12.0m, 5.0m, new DateTime(2022, 06, 07));
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
        return new Order("Joana", 2.0m, 3.0m, new DateTime(2022, 06, 09));
    }
}