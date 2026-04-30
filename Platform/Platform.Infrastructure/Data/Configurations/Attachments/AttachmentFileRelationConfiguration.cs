using Platform.Domain.Entities.Attachments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Attachments;

public class AttachmentFileRelationConfiguration : IEntityTypeConfiguration<AttachmentFileRelation>
{
    public void Configure(EntityTypeBuilder<AttachmentFileRelation> builder)
    {
        builder.ToTable("attachment_file_relation");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasColumnName("id");
        builder.Property(r => r.MetadataId).HasColumnName("metadata_id").IsRequired();
        builder.Property(r => r.EntityId).HasColumnName("entity_id").IsRequired();
        builder.Property(r => r.EntityType).HasColumnName("entity_type").HasMaxLength(100).IsRequired();

        builder.HasIndex(r => new { r.EntityId, r.EntityType }).HasDatabaseName("ix_attachment_relation_entity");
    }
}
