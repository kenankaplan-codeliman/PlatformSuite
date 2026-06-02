using Platform.Application.Modals.Common;

namespace Crm.Application.Features.Opportunities.Dtos;

public class OpportunityProductModal
{
    public Guid Id { get; set; }
    // İlişki EntityReference olarak taşınır (ham Guid değil) — client'ta EntityLookupField.
    public EntityReference? Product { get; set; }
    public decimal Quantity { get; set; }
    // Para birimi parent Opportunity.Currency'den gelir — satır seviyesinde tutulmaz.
    public decimal UnitPrice { get; set; }
    // Ölçü birimi snapshot'ı (GeneralParameter code, parentCode: ProductUnitOfMeasure).
    // Ürün seçilince Product.UnitOfMeasure'dan prefill edilir.
    public string? UnitCode { get; set; }
    // İndirim alanları — önce oran sonra tutar uygulanır:
    //   netAmount = max(0, lineTotal − lineTotal × discountRate/100 − discountAmount)
    public decimal DiscountRate { get; set; }
    public decimal DiscountAmount { get; set; }
    // Sunucu hesaplar: brüt satır toplamı (Quantity × UnitPrice).
    public decimal LineTotal { get; set; }
    // Sunucu hesaplar: net tutar (indirimler düşülmüş).
    public decimal NetAmount { get; set; }
}
