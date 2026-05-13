using CodePro.Application.Features.PriceLists.Dtos;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;
using Platform.Application.Modals.Common;

namespace CodePro.Application.Features.PriceLists.Commands.CreatePriceList;

public sealed class CreatePriceListCommand : ICommand<PriceListDetailItem>, IAttachmentCarrier
{
    public string? Code { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public EntityReference? Supplier { get; init; }
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
