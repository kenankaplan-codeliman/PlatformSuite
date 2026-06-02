using Platform.Domain.Entities.Common;

namespace Crm.Domain.Entities.Products;

public class Product :
    IBaseEntity,
    IOwnedEntity,
    IAuditableEntity,
    ISoftDeleteEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    public string Name { get; set; } = null!;

    // Benzersiz ürün/SKU kodu (is_deleted = false filtreli unique index).
    public string ProductCode { get; set; } = null!;

    // GeneralParameter code olarak tutulur (parentCode: ProductParameterCodes.Category).
    public string? Category { get; set; }

    public decimal? UnitPrice { get; set; }
    // UnitPrice'ın para birimi — GeneralParameter code (parentCode: CurrencyType).
    public string? UnitPriceCurrency { get; set; }

    // GeneralParameter code (parentCode: ProductParameterCodes.UnitOfMeasure).
    public string? UnitOfMeasure { get; set; }

    public string? Description { get; set; }

    // IOwnedEntity
    public Guid OwnerId { get; private set; }
    public Guid OrganizationId { get; private set; }

    // IAuditableEntity
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // ISoftDeleteEntity
    public bool IsDeleted { get; private set; }
    public Guid? DeletedBy { get; private set; }
    public DateTime? DeletedAt { get; private set; }
}
