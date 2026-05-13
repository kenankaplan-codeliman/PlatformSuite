using CodePro.Application.Features.ProductCategories.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.ProductCategories.Commands.UpdateProductCategory;

public sealed class UpdateProductCategoryCommand : ICommand<ProductCategoryDetailItem>, IAttachmentCarrier
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Code { get; init; }
    public string? Description { get; init; }
    public Guid? ParentCategoryId { get; init; }
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
