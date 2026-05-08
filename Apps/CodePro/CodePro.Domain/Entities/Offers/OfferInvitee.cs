using CodePro.Domain.Entities.Suppliers;

namespace CodePro.Domain.Entities.Offers
{
    public class OfferInvitee
    {
        public Guid Id { get; set; }
        public Guid OfferId { get; set; }

        /// <summary>Davet edilen tedarikçinin Platform Account'a referansı (opsiyonel — manuel giriş için null).</summary>
        public Guid? SupplierId { get; set; }
        public Supplier? Supplier { get; set; }

        public string SupplierName { get; set; } = string.Empty;
        public string? SupplierEmail { get; set; }
        public DateTime? InvitedAt { get; set; }
        public string Status { get; set; } = "Invited"; // Invited | Responded | Declined | NotResponded

        // Tedarikçinin verdiği teklif (manuel giriş)
        public decimal? QuoteAmount { get; set; }
        public string? QuoteCurrency { get; set; }
        public string? QuoteNotes { get; set; }
        public DateTime? QuotedAt { get; set; }
    }
}
