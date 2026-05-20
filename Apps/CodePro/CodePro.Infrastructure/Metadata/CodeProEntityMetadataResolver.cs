using CodePro.Infrastructure.Data;
using Platform.Application.Interfaces;
using Platform.Infrastructure.Metadata;

namespace CodePro.Infrastructure.Metadata;

/// <summary>
/// CodePro entity'lerinin (Supplier, PurchaseOrder, Budget, Offer, …) ortak metadata'sını çözer.
/// Tüm generic mantık <see cref="EntityMetadataResolverBase"/>'te; burada sadece CodeProDbContext bağlanır.
/// </summary>
public sealed class CodeProEntityMetadataResolver : EntityMetadataResolverBase
{
    public CodeProEntityMetadataResolver(CodeProDbContext db, IReferenceRepository references)
        : base(db, references)
    {
    }
}
