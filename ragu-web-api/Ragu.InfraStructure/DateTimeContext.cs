namespace Ragu.InfraStructure;

public class DateTimeContext
{
    private static readonly Func<DateTime> defaultNow = () => DateTime.Now;
    private static Func<DateTime> now = defaultNow;

    public static DateTime Now => now();

    public static void SetNow(Func<DateTime> newNow)
    {
        now = newNow;
    }

    public static void Reset()
    {
        now = defaultNow;
    }
}