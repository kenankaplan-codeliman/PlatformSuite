namespace Platform.Domain.Entities.Attachments;

/// <summary>
/// Bir ek dosyanın hangi entity ile ilişkili olduğunu tutar. EntityType string olarak
/// saklanır — her app kendi tipini özgürce ekleyebilir (Account, Contact, Lead,
/// Opportunity, Brand, Product, PurchaseOrder, ...).
/// </summary>
public class AttachmentFileRelation
{
    public Guid Id { get; set; }
    public Guid MetadataId { get; set; }
    public Guid EntityId { get; set; }
    public string EntityType { get; set; } = null!;

    // Navigation
    public AttachmentFileMetadata Metadata { get; set; } = null!;
}
