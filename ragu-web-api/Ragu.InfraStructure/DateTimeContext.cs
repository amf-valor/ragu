namespace Ragu.InfraStructure;

public class DateTimeContext
{
    private static Func<DateTime> dateTimeNowFunc = () => DateTime.Now;
    public static DateTime Now => dateTimeNowFunc();

    public static void Set(Func<DateTime> dateTimeNowFunc)
    {
        DateTimeContext.dateTimeNowFunc = dateTimeNowFunc;
    }
}