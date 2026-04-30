using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Application.Features.EDocuments.Dtos;

public class EDocumentListItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public DocumentType DocumentType { get; set; }
    public EDocumentStatus Status { get; set; }
    public string EntityType { get; set; } = default!;
    public Guid EntityId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
