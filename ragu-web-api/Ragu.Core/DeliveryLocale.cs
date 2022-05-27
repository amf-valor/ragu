namespace Ragu.Core;

public class DeliveryLocale
{
    private readonly string _hood;
    private readonly decimal _tax;

#pragma warning disable CS0649 //auto generated ORM
    private readonly int _id;
#pragma warning restore CS0649

    public string Hood { get => _hood; }
    public decimal Tax { get => _tax; }
    public int Id { get => _id; }

    public DeliveryLocale(string hood, decimal tax)
    {
        _hood = hood;
        _tax = tax;
    }

}
