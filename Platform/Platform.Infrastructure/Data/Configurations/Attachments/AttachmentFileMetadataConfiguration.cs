using Platform.Domain.Entities.Attachments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Attachments;

public class AttachmentFileMetadataConfiguration : IEntityTypeConfiguration<AttachmentFileMetadata>
{
    public void Configure(EntityTypeBuilder<AttachmentFileMetadata> builder)
    {
        builder.ToTable("attachment_file_metadata");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("id");
        builder.Property(m => m.FileDataId).HasColumnName("file_data_id").IsRequired();
        builder.Property(m => m.FileName).HasColumnName("file_name").IsRequired().HasMaxLength(500);
        builder.Property(m => m.ContentType).HasColumnName("content_type").IsRequired().HasMaxLength(200);
        builder.Property(m => m.FileSize).HasColumnName("file_size").IsRequired();
        builder.Property(m => m.DocumentType)
            .HasColumnName("document_type")
            .IsRequired()
            .HasMaxLength(100)
            .HasDefaultValue("Other");
        builder.Property(m => m.Subject).HasColumnName("subject").HasMaxLength(500);
        builder.Property(m => m.Description).HasColumnName("description").HasColumnType("text");
        builder.Property(m => m.ExpiresAt).HasColumnName("expires_at");
        builder.Property(m => m.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
        builder.Property(m => m.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(m => m.OrganizationId).HasColumnName("organization_id").IsRequired();
        builder.Property(m => m.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(m => m.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(m => m.UpdatedBy).HasColumnName("updated_by");
        builder.Property(m => m.UpdatedAt).HasColumnName("updated_at");
        builder.Property(m => m.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(m => m.DeletedBy).HasColumnName("deleted_by");
        builder.Property(m => m.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(m => m.FileData)
            .WithOne(d => d.Metadata)
            .HasForeignKey<AttachmentFileMetadata>(m => m.FileDataId)
            .HasConstraintName("fk_attachment_metadata_data")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(m => m.Relations)
            .WithOne(r => r.Metadata)
            .HasForeignKey(r => r.MetadataId)
            .HasConstraintName("fk_attachment_relation_metadata")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(m => m.ExpiresAt).HasDatabaseName("ix_attachment_metadata_expires_at");
    }
}
