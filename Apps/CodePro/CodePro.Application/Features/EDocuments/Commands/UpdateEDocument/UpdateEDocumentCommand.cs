using CodePro.Application.Features.EDocuments.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;
using Platform.Domain.Enums;

namespace CodePro.Application.Features.EDocuments.Commands.UpdateEDocument;

public sealed class UpdateEDocumentCommand : ICommand<EDocumentDetailItem>
{
    public Guid Id { get; init; }
    public string Subject { get; init; } = string.Empty;
    public string? Description { get; init; }
    public DocumentType DocumentType { get; init; }
    public EDocumentStatus Status { get; init; }
    public string EntityType { get; init; } = string.Empty;
    public Guid EntityId { get; init; }
    public string? AttachmentUrl { get; init; }
    public string? RoutingType { get; init; }
    public string? RoutingGroups { get; init; }
    public string? RoutingPersonIds { get; init; }
    public string? RoutingPersonNames { get; init; }
}
