namespace Ragu.Core
{
    public class DeliveryLocale
    {
        private string _hood;
        private decimal _tax;
        private int _id;

        public string Hood { get => _hood; }
        public decimal Tax { get => _tax; }
        public int Id { get => _id; }

        public DeliveryLocale(int id, string hood, decimal tax)
        {
            _id = id;
            _hood = hood;
            _tax = tax;
        }

    }
}