using Platform.Domain.Entities.Identities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Identities;

public class AppOrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.ToTable("app_organization");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.OrganizationCode)
            .HasColumnName("organization_code")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.OrganizationName)
            .HasColumnName("organization_name")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(e => e.Title)
            .HasColumnName("title")
            .HasMaxLength(500);

        builder.Property(e => e.Type)
            .HasColumnName("type")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.CostCenter)
            .HasColumnName("cost_center")
            .HasMaxLength(100);

        builder.Property(e => e.ParentOrganizationId)
            .HasColumnName("parent_organization_id");

        builder.Property(e => e.ReportsTo)
            .HasColumnName("reports_to");

        builder.Property(e => e.IsDefault)
            .HasColumnName("is_default")
            .IsRequired();

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired();

        // Audit
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

        // Soft Delete
        builder.Property(e => e.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.Property(e => e.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        // Self-referencing
        builder.HasOne<Organization>()
            .WithMany()
            .HasForeignKey(e => e.ParentOrganizationId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
