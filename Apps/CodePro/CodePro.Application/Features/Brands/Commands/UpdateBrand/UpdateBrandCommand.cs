using CodePro.Application.Features.Brands.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Brands.Commands.UpdateBrand;

public sealed class UpdateBrandCommand : ICommand<BrandDetailItem>, IAttachmentCarrier
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
