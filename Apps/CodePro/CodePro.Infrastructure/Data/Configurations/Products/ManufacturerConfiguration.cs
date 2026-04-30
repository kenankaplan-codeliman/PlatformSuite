using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ManufacturerConfiguration : IEntityTypeConfiguration<Manufacturer>
{
    public void Configure(EntityTypeBuilder<Manufacturer> builder)
    {
        builder.ToTable("manufacturer");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("id");
        builder.Property(m => m.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
        builder.Property(m => m.Name).HasColumnName("name").IsRequired().HasMaxLength(100);
        builder.HasIndex(m => m.Name).IsUnique().HasFilter("is_deleted = FALSE");
        builder.Property(m => m.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(m => m.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(m => m.UpdatedBy).HasColumnName("updated_by");
        builder.Property(m => m.UpdatedAt).HasColumnName("updated_at");
        builder.Property(m => m.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(m => m.DeletedBy).HasColumnName("deleted_by");
        builder.Property(m => m.DeletedAt).HasColumnName("deleted_at");
    }
}
