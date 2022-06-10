namespace Ragu.InfraStructure;

public static class Extensions
{
    public static DateTimeOffset AtEnd(this DateTimeOffset aDate) => SameDateNewTime(aDate, 23, 59, 59, 999);

    public static DateTimeOffset AtBegin(this DateTimeOffset aDate) => SameDateNewTime(aDate, 0, 0, 0, 0);

    private static DateTimeOffset SameDateNewTime(DateTimeOffset aDate, int hour, int minute, int second, int millisecond)
    {
        return new DateTimeOffset(aDate.Year,
                                  aDate.Month,
                                  aDate.Day,
                                  hour, minute, second, millisecond,
                                  aDate.Offset);
    }
}