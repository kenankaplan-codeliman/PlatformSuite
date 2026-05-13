using CodePro.Application.Features.Manufacturers.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Manufacturers.Commands.CreateManufacturer;

public sealed class CreateManufacturerCommand : ICommand<ManufacturerDetailItem>, IAttachmentCarrier
{
    public string Name { get; init; } = string.Empty;
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
