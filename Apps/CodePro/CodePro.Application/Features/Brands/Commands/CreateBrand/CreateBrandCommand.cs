using CodePro.Application.Features.Brands.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Brands.Commands.CreateBrand;

public sealed class CreateBrandCommand : ICommand<BrandDetailItem>, IAttachmentCarrier
{
    public string Name { get; init; } = string.Empty;
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
