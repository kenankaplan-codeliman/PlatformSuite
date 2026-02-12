using CRM.Domain.Entities.Identities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRM.Infrastructure.Data.Configurations.Identities;

public class AppPrivilegeConfiguration : IEntityTypeConfiguration<AppPrivilege>
{
    public void Configure(EntityTypeBuilder<AppPrivilege> builder)
    {
        builder.ToTable("app_privilege");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.PrivilegeCode)
            .HasColumnName("privilege_code")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.PrivilegeName)
            .HasColumnName("privilege_name")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(1000);

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
    }
}
