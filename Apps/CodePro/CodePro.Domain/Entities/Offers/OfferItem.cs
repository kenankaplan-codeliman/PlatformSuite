using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Domain.Entities.Offers
{
    public class OfferItem
    {
        public Guid Id { get; set; }
        public Guid OfferId { get; set; }
        public int OrderIndex { get; set; }

        public Guid? ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;

        public decimal Quantity { get; set; } = 1;
        public OfferUnit Unit { get; set; } = OfferUnit.Piece;
        public decimal UnitPrice { get; set; }
        public OfferVatRate VatRate { get; set; } = OfferVatRate.Twenty;

        public decimal LineTotal { get; set; }
        public decimal LineVat { get; set; }
    }
}
