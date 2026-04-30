using Platform.Domain.Entities.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Communications;

public abstract class PhoneBaseConfiguration<T> : IEntityTypeConfiguration<T>
    where T : PhoneBase
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");

        builder.Property(p => p.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.PhoneNumber)
            .HasColumnName("phone_number")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.Type)
            .HasColumnName("type")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(p => p.IsPrimary)
            .HasColumnName("is_primary")
            .IsRequired()
            .HasDefaultValue(false);

        // Audit
        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(p => p.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);
        builder.Property(p => p.DeletedBy).HasColumnName("deleted_by");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");
    }
}
