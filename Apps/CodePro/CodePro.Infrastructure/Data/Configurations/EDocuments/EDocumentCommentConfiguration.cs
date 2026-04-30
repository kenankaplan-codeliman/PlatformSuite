using CodePro.Domain.Entities.EDocuments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.EDocuments;

public class EDocumentCommentConfiguration : IEntityTypeConfiguration<EDocumentComment>
{
    public void Configure(EntityTypeBuilder<EDocumentComment> builder)
    {
        builder.ToTable("e_document_comment");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.EDocumentId).HasColumnName("e_document_id").IsRequired();
        builder.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(e => e.UserName).HasColumnName("user_name").HasMaxLength(200).IsRequired();
        builder.Property(e => e.Content).HasColumnName("content").HasMaxLength(2000).IsRequired();
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
    }
}
