using CodePro.Domain.Enums;
using Platform.Domain.Enums;

namespace CodePro.Application.Features.EDocuments.Dtos;

public class EDocumentListFilter
{
    public string? Search { get; set; }
    public DocumentType? DocumentType { get; set; }
    public EDocumentStatus? Status { get; set; }
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }
    public bool? IsActive { get; set; }
}
