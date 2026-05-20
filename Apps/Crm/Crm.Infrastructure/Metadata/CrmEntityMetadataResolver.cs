using Crm.Infrastructure.Data;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Metadata;

namespace Crm.Infrastructure.Metadata;

/// <summary>
/// CRM entity'lerinin (Account, Contact, Lead, Opportunity, …) ortak metadata'sını çözer.
/// Tüm generic mantık <see cref="EntityMetadataResolverBase"/>'te; burada sadece CrmDbContext bağlanır.
/// </summary>
public sealed class CrmEntityMetadataResolver : EntityMetadataResolverBase
{
    public CrmEntityMetadataResolver(CrmDbContext db, IReferenceRepository references)
        : base(db, references)
    {
    }
}
