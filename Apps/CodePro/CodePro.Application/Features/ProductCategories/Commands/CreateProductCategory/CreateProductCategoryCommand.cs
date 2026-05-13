using CodePro.Application.Features.ProductCategories.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.ProductCategories.Commands.CreateProductCategory;

public sealed class CreateProductCategoryCommand : ICommand<ProductCategoryDetailItem>, IAttachmentCarrier
{
    public string Name { get; init; } = string.Empty;
    public string? Code { get; init; }
    public string? Description { get; init; }
    public Guid? ParentCategoryId { get; init; }
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
