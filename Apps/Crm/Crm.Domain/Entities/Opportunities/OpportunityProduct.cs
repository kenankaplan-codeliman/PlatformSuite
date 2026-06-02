using System.ComponentModel.DataAnnotations.Schema;
using Platform.Domain.Entities.Common;
using Crm.Domain.Entities.Products;

namespace Crm.Domain.Entities.Opportunities;

// Opportunity aggregate'inin satır kalemi child'ı (AccountContact gibi — ayrı klasör açılmaz).
// IOwnedEntity DEĞİL: parent Opportunity'nin owner/org'una bağlı.
public class OpportunityProduct : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid OpportunityId { get; set; }
    public Opportunity Opportunity { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public decimal Quantity { get; set; }
    // Satır kalemine alındığı andaki birim fiyat snapshot'ı (ürün fiyatından bağımsız düzenlenebilir).
    // Para birimi parent Opportunity'nin Currency'si — line-level currency yok.
    public decimal UnitPrice { get; set; }

    // Satır kalemine alındığı andaki ölçü birimi snapshot'ı (GeneralParameter code,
    // parentCode: ProductParameterCodes.UnitOfMeasure). Ürün seçilince varsayılan olarak
    // Product.UnitOfMeasure'dan prefill edilir; satırda değiştirilebilir.
    public string? UnitCode { get; set; }

    /// <summary>
    /// Satır indirim oranı (yüzde, 0-100). Önce uygulanır: <c>brüt × oran/100</c>.
    /// Tutar cinsi indirim (<see cref="DiscountAmount"/>) bu adımdan sonra düşürülür.
    /// </summary>
    public decimal DiscountRate { get; set; }

    /// <summary>
    /// Satır indirim tutarı (currency = parent Opportunity.Currency). Oran indirimden
    /// SONRA brütten düşürülür. <see cref="NetAmount"/> 0 altına düşmez (clamp).
    /// </summary>
    public decimal DiscountAmount { get; set; }

    [NotMapped]
    public decimal LineTotal => Quantity * UnitPrice;

    /// <summary>Satırın oran cinsinden indirim tutarı: <c>LineTotal × DiscountRate / 100</c>.</summary>
    [NotMapped]
    public decimal LineDiscountRateAmount => LineTotal * DiscountRate / 100m;

    /// <summary>Satırın toplam indirim tutarı (oran + tutar).</summary>
    [NotMapped]
    public decimal LineDiscountTotal => LineDiscountRateAmount + DiscountAmount;

    /// <summary>Satır net tutarı: <c>max(0, LineTotal − LineDiscountTotal)</c>.</summary>
    [NotMapped]
    public decimal NetAmount
    {
        get
        {
            var net = LineTotal - LineDiscountTotal;
            return net < 0m ? 0m : net;
        }
    }

    // Audit
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Soft Delete
    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
