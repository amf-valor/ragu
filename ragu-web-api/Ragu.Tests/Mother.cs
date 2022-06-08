using System;
using Ragu.Core;

namespace Ragu.Tests;

public static class Mother
{
    public static Order OrderOfJohn()
    {
        var tomorrow = DateTime.Now.AddDays(1);
        var tomorrowAtMidDay = new DateTime(tomorrow.Year, tomorrow.Month, tomorrow.Day, 12, 0, 0);
        return new Order("John", 10.0m, 4.0m, tomorrowAtMidDay);
    }
}