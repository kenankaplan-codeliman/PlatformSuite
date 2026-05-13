namespace Platform.Application.Common.Attachments;

/// <summary>
/// Bir create/update command'ının yanında pending draft attachment referansları
/// taşımasını sağlar. Command handler entity insert/update sonrası ID alır ve
/// IAttachmentRepository.AssociateAsync ile relation kurar — hepsi tek
/// TransactionBehavior altında commit edilir.
/// </summary>
public interface IAttachmentCarrier
{
    List<AttachmentAssociation> Attachments { get; }
}

/// <summary>
/// Pending bir draft attachment'a referans. DocumentType / Subject / Description
/// draft upload zamanı kaydedilir; associate sadece relation kurar.
/// </summary>
public sealed class AttachmentAssociation
{
    public Guid MetadataId { get; init; }
}
