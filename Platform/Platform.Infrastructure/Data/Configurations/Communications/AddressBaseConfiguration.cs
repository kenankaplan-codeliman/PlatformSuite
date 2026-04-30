using Platform.Domain.Entities.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Communications;

public abstract class AddressBaseConfiguration<T> : IEntityTypeConfiguration<T>
    where T : AddressBase
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id");

        builder.Property(a => a.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(a => a.AddressLine1)
            .HasColumnName("address_line1")
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(a => a.AddressLine2)
            .HasColumnName("address_line2")
            .HasMaxLength(250);

        builder.Property(a => a.City).HasColumnName("city").HasMaxLength(150);
        builder.Property(a => a.State).HasColumnName("state").HasMaxLength(150);
        builder.Property(a => a.PostalCode).HasColumnName("postal_code").HasMaxLength(50);
        builder.Property(a => a.Country).HasColumnName("country").HasMaxLength(150);

        builder.Property(a => a.Type)
            .HasColumnName("type")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(a => a.IsPrimary)
            .HasColumnName("is_primary")
            .IsRequired()
            .HasDefaultValue(false);

        // Audit
        builder.Property(a => a.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(a => a.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(a => a.UpdatedBy).HasColumnName("updated_by");
        builder.Property(a => a.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(a => a.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);
        builder.Property(a => a.DeletedBy).HasColumnName("deleted_by");
        builder.Property(a => a.DeletedAt).HasColumnName("deleted_at");
    }
}
