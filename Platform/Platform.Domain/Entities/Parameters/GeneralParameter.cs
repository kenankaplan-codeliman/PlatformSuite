using Platform.Domain.Entities.Common;

namespace Platform.Domain.Entities.Parameters;

/// <summary>
/// Logic taşımayan enumların yerini alan dinamik parametre yapısı.
/// <c>code</c> + <c>parent_code</c> ile hiyerarşik tutulur:
///   - Kök satır:    Code = enum tip adı (ör. "LeadStatus"), ParentCode = null
///   - Değer satırı: Code = enum değeri (ör. "New"),          ParentCode = "LeadStatus"
///
/// Global sistem referans verisidir — <see cref="IOwnedEntity"/> uygulamaz,
/// owner/organization query filtresine tabi değildir. Ekleme/güncelleme
/// InitData SQL seed ile yönetilir; API yalnız okur.
/// </summary>
public class GeneralParameter : IBaseEntity, IAuditableEntity
{
    // IBaseEntity
    public Guid Id { get; set; }
    public bool IsActive { get; private set; } = true;

    /// <summary>Enum değeri ya da kök satırda enum tip adı.</summary>
    public string Code { get; set; } = null!;

    /// <summary>Kök satırlarda null; değer satırlarında bağlı olduğu tip adı.</summary>
    public string? ParentCode { get; set; }

    /// <summary>
    /// Dil kodu (ör. "tr", "en"). Aynı code farklı dillerde ayrı satırlarda tutulur;
    /// yalnızca <see cref="Label"/> dile bağımlıdır. Kod doğrulaması (ExistsAsync) dilden
    /// bağımsızdır; liste/label sorguları lang alır ve eksikse varsayılan dile fallback yapar.
    /// </summary>
    public string Lang { get; set; } = "tr";

    /// <summary>Görünen metin (DB'de tutulur, dile bağımlı).</summary>
    public string Label { get; set; } = null!;

    /// <summary>Dropdown sıralaması — enum dizilim sırasının yerini tutar.</summary>
    public int OrderIndex { get; set; }

    public string? Description { get; set; }

    // Audit
    public Guid CreatedBy { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
}
