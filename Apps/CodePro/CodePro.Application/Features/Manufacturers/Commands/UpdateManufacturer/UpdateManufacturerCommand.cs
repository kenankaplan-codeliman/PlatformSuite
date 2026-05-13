using CodePro.Application.Features.Manufacturers.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Manufacturers.Commands.UpdateManufacturer;

public sealed class UpdateManufacturerCommand : ICommand<ManufacturerDetailItem>, IAttachmentCarrier
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
