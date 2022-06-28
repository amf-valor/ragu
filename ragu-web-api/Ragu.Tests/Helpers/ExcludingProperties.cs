using FluentAssertions.Equivalency;
using Ragu.Core;

namespace Ragu.Tests.Helpers;

public class ExcludingProperties
{
    public static EquivalencyAssertionOptions<Product> ExcludeProductProperties(EquivalencyAssertionOptions<Product> options)
    {
        options.Excluding(_ => _.Orders);
        options.Excluding(_ => _.IsDeleted);
        return options;
    }
}