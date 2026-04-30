namespace CodePro.Domain.Entities.EDocuments
{
    public class EDocumentApproval
    {
        public Guid Id { get; set; }
        public Guid EDocumentId { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        /// <summary>pending | approved | rejected</summary>
        public string Status { get; set; } = "pending";
        public string? Comment { get; set; }
        public DateTime? ActionDate { get; set; }
        public DateTime? SeenAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
