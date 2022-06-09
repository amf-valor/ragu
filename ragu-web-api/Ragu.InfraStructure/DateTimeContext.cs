using System.Collections;

namespace Ragu.InfraStructure;

public class DateTimeProvider
{
    public static DateTime Now => DateTimeContext.GetCurrent().Now;
}

public sealed class DateTimeContext : IDisposable
{
    internal readonly DateTime Now;
    private static readonly ThreadLocal<Stack> threadScopeStack = new(() => new Stack());

    public DateTimeContext(DateTime now)
    {
        Now = now;
        threadScopeStack.Value?.Push(this);
    }

    public static DateTimeContext GetCurrent()
    {
        return threadScopeStack.Value?.Count == 0
            ? new DateTimeContext(DateTime.Now)
            : (DateTimeContext)threadScopeStack.Value?.Peek()!;
    }

    public void Dispose()
    {
        if (threadScopeStack.Value?.Count > 0)
            threadScopeStack.Value?.Pop();
    }
}