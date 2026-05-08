using Platform.Application.Modals.Common;

namespace Platform.Application.Common.References;

/// <summary>
/// Bir entity türü için EntityReference (id → ad/email/telefon) çözümleyicisi.
/// Her uygulama (CRM, CodePro vb.) kendi entity'leri için resolver kaydeder;
/// ReferenceRepository registry üzerinden ilgili resolver'a delegasyon yapar.
/// </summary>
public interface IEntityReferenceResolver
{
    /// <summary>Resolver'ın çözdüğü entity türü (string, polimorfik anahtar).</summary>
    string EntityType { get; }

    EntityReference GetReference(Guid id);

    EntityReferenceList LookupReference(string? searchText, PaginationInfo paginationInfo);
}
