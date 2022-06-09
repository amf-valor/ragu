using System;
using Ragu.Core;
using Ragu.InfraStructure;
using static Namespace.OrdersController;

namespace Ragu.Tests;

public static class Mother
{
    public static Order OrderOfJohn()
    {
        return new Order("John", 10.0m, 4.0m, TodayAtMidDay());
    }

    private static DateTime TodayAtMidDay()
    {
        return new DateTime(DateTimeProvider.Now.Year,
                            DateTimeProvider.Now.Month,
                            DateTimeProvider.Now.Day,
                            12,
                            0,
                            0);
    }

    public static GetByBookedFromResponse GetByBookedFromResponseOfJohn()
    {
        return new GetByBookedFromResponse
        {
            CustomerName = "John",
            BookedAt = TodayAtMidDay()
        };
    }
}