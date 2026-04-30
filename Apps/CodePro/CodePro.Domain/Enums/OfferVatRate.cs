namespace CodePro.Domain.Enums
{
    public enum OfferVatRate
    {
        Zero,    // %0
        One,     // %1
        Ten,     // %10
        Twenty   // %20
    }

    public static class OfferVatRateExtensions
    {
        public static decimal ToDecimal(this OfferVatRate rate) => rate switch
        {
            OfferVatRate.Zero   => 0.00m,
            OfferVatRate.One    => 0.01m,
            OfferVatRate.Ten    => 0.10m,
            OfferVatRate.Twenty => 0.20m,
            _ => 0.00m,
        };
    }
}
