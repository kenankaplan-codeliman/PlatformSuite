using CodePro.Domain.Entities.Products;
using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Common;

namespace CodePro.Domain.Entities.Accounts;

/// <summary>
/// Account ↔ ProductCategory N:N junction. Tedarikçi rolündeki Account'ları
/// hangi ürün kategorilerinde faaliyet gösterdiklerine bağlar. Tek yönlü
/// navigasyon: junction → Account; Platform Account'ta ters koleksiyon yok
/// (CodePro → Platform.Domain bağımlılığını korumak için).
/// </summary>
public class AccountProductCategory : IBaseEntity, IAuditableEntity, ISoftDeleteEntity
{
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;

    public Guid ProductCategoryId { get; set; }
    public ProductCategory ProductCategory { get; set; } = null!;

    public bool IsPreferred { get; set; }

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
