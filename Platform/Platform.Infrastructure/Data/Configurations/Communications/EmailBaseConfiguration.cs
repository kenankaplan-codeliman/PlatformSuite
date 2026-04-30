using Platform.Domain.Entities.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Communications;

public abstract class EmailBaseConfiguration<T> : IEntityTypeConfiguration<T>
    where T : EmailBase
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(e => e.Email)
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(320);

        builder.Property(e => e.Type)
            .HasColumnName("type")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.IsPrimary)
            .HasColumnName("is_primary")
            .IsRequired()
            .HasDefaultValue(false);

        // Audit
        builder.Property(e => e.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(e => e.UpdatedBy).HasColumnName("updated_by");
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(e => e.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);
        builder.Property(e => e.DeletedBy).HasColumnName("deleted_by");
        builder.Property(e => e.DeletedAt).HasColumnName("deleted_at");
    }
}
