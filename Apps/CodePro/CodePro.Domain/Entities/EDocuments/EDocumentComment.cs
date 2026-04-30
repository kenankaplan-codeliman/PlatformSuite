namespace CodePro.Domain.Entities.EDocuments
{
    public class EDocumentComment
    {
        public Guid Id { get; set; }
        public Guid EDocumentId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
