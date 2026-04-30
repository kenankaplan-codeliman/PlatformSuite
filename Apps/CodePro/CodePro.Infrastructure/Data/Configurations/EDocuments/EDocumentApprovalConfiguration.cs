using CodePro.Domain.Entities.EDocuments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.EDocuments;

public class EDocumentApprovalConfiguration : IEntityTypeConfiguration<EDocumentApproval>
{
    public void Configure(EntityTypeBuilder<EDocumentApproval> builder)
    {
        builder.ToTable("e_document_approval");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.EDocumentId).HasColumnName("e_document_id").IsRequired();
        builder.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(e => e.UserName).HasColumnName("user_name").HasMaxLength(200);
        builder.Property(e => e.Status).HasColumnName("status").HasMaxLength(50).IsRequired();
        builder.Property(e => e.Comment).HasColumnName("comment").HasMaxLength(2000);
        builder.Property(e => e.ActionDate).HasColumnName("action_date");
        builder.Property(e => e.SeenAt).HasColumnName("seen_at");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
    }
}
