using CodePro.Application.Features.ProductCatalogs.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.ProductCatalogs.Commands.CreateProductCatalog;

public sealed class CreateProductCatalogCommand : ICommand<ProductCatalogDetailItem>, IAttachmentCarrier
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DateTime ValidFrom { get; init; }
    public DateTime ValidUntil { get; init; }
    public string? PriceCode { get; init; }
    public List<Guid> ProductIds { get; init; } = new();
    public List<Guid> OrganizationIds { get; init; } = new();
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
