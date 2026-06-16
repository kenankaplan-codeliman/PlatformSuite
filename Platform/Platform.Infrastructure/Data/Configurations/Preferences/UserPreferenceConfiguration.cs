using Platform.Domain.Entities.Preferences;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Preferences;

public class UserPreferenceConfiguration : IEntityTypeConfiguration<UserPreference>
{
    public void Configure(EntityTypeBuilder<UserPreference> builder)
    {
        builder.ToTable("user_preference");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");

        builder.Property(p => p.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.PreferenceKey)
            .HasColumnName("preference_key")
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(p => p.Value)
            .HasColumnName("value")
            .HasColumnType("text")
            .IsRequired();

        // Owner
        builder.Property(p => p.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(p => p.OrganizationId).HasColumnName("organization_id").IsRequired();

        // Audit
        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(p => p.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(p => p.DeletedBy).HasColumnName("deleted_by");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");

        // Kullanıcı + anahtar başına tek tercih.
        builder.HasIndex(p => new { p.OwnerId, p.PreferenceKey })
            .IsUnique()
            .HasDatabaseName("ux_user_preference_owner_key");
    }
}
