using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Application.Features.EDocuments.Dtos;

public class EDocumentDetailItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public string? Description { get; set; }
    public DocumentType DocumentType { get; set; }
    public EDocumentStatus Status { get; set; }
    public string EntityType { get; set; } = default!;
    public Guid EntityId { get; set; }
    public string? AttachmentUrl { get; set; }
    public string? RoutingType { get; set; }
    public string? RoutingGroups { get; set; }
    public string? RoutingPersonIds { get; set; }
    public string? RoutingPersonNames { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
