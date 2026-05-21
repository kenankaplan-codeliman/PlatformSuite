using Crm.Domain.Entities.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Communications;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.ToTable("address");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id");

        builder.Property(a => a.IsActive)
            .HasColumnName("is_active").IsRequired().HasDefaultValue(true);

        builder.Property(a => a.ParentEntityType)
            .HasColumnName("parent_entity_type").IsRequired().HasMaxLength(100);

        builder.Property(a => a.ParentEntityId)
            .HasColumnName("parent_entity_id").IsRequired();

        builder.Property(a => a.AddressLine1)
            .HasColumnName("address_line1").IsRequired().HasMaxLength(250);
        builder.Property(a => a.AddressLine2).HasColumnName("address_line2").HasMaxLength(250);

        // GeneralParameter kodları (parent_code zinciri) + denormalize edilmiş adlar (snapshot)
        builder.Property(a => a.CountryCode).HasColumnName("country_code").HasMaxLength(100);
        builder.Property(a => a.CountryName).HasColumnName("country_name").HasMaxLength(150);
        builder.Property(a => a.CityCode).HasColumnName("city_code").HasMaxLength(100);
        builder.Property(a => a.CityName).HasColumnName("city_name").HasMaxLength(150);
        builder.Property(a => a.DistrictCode).HasColumnName("district_code").HasMaxLength(100);
        builder.Property(a => a.DistrictName).HasColumnName("district_name").HasMaxLength(150);

        builder.Property(a => a.State).HasColumnName("state").HasMaxLength(150);
        builder.Property(a => a.PostalCode).HasColumnName("postal_code").HasMaxLength(50);

        builder.Property(a => a.Type)
            .HasColumnName("type").IsRequired().HasConversion<string>().HasMaxLength(50);

        builder.Property(a => a.IsPrimary)
            .HasColumnName("is_primary").IsRequired().HasDefaultValue(false);

        // Audit
        builder.Property(a => a.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(a => a.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(a => a.UpdatedBy).HasColumnName("updated_by");
        builder.Property(a => a.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(a => a.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(a => a.DeletedBy).HasColumnName("deleted_by");
        builder.Property(a => a.DeletedAt).HasColumnName("deleted_at");

        builder.HasIndex(a => new { a.ParentEntityType, a.ParentEntityId })
            .HasDatabaseName("ix_address_parent");
    }
}
