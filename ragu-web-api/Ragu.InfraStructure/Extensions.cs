namespace Ragu.InfraStructure;

public static class Extensions
{
    public static DateTimeOffset AtEnd(this DateTimeOffset ofDay)
    {
        return new DateTimeOffset(ofDay.Year,
                                  ofDay.Month,
                                  ofDay.Day,
                                  23, 59, 59, 999,
                                  ofDay.Offset);
    }
}