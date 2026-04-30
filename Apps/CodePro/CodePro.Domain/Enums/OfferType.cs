namespace CodePro.Domain.Enums
{
    public enum OfferType
    {
        Rfi,       // Request for Information — bilgi talebi
        Rfq,       // Request for Quotation — fiyat teklifi talebi
        Rfp,       // Request for Proposal — teklif çağrısı
        // Legacy — eski kayıtların bozulmaması için tutuluyor
        Purchase,
        Sale
    }
}
