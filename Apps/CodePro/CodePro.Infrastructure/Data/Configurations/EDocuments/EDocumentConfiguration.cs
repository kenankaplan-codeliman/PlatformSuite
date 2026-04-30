using CodePro.Domain.Entities.EDocuments;
using CodePro.Domain.Enums;
using Platform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CodePro.Infrastructure.Data.Configurations.EDocuments;

public class EDocumentConfiguration : IEntityTypeConfiguration<EDocument>
{
    public void Configure(EntityTypeBuilder<EDocument> builder)
    {
        builder.ToTable("e_document");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.Subject)
            .HasColumnName("subject")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(2000);

        builder.Property(e => e.DocumentType)
            .HasColumnName("document_type")
            .HasMaxLength(50)
            .IsRequired()
            .HasConversion<EnumToStringConverter<DocumentType>>();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(50)
            .IsRequired()
            .HasConversion<EnumToStringConverter<EDocumentStatus>>();

        builder.Property(e => e.EntityType)
            .HasColumnName("entity_type")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.EntityId)
            .HasColumnName("entity_id")
            .IsRequired();

        builder.Property(e => e.AttachmentUrl)
            .HasColumnName("attachment_url")
            .HasMaxLength(1000);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired();

        builder.Property(e => e.OwnerId)
            .HasColumnName("owner_id")
            .IsRequired();

        builder.Property(e => e.OrganizationId)
            .HasColumnName("organization_id")
            .IsRequired();

        builder.Property(e => e.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(e => e.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(e => e.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.Property(e => e.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        builder.Property(e => e.RoutingType)
            .HasColumnName("routing_type")
            .HasMaxLength(50);

        builder.Property(e => e.RoutingGroups)
            .HasColumnName("routing_groups")
            .HasMaxLength(500);

        builder.Property(e => e.RoutingPersonIds)
            .HasColumnName("routing_person_ids")
            .HasMaxLength(2000);

        builder.Property(e => e.RoutingPersonNames)
            .HasColumnName("routing_person_names")
            .HasMaxLength(2000);
    }
}
