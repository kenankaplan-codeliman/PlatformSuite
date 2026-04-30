using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductCatalogConfiguration : IEntityTypeConfiguration<ProductCatalog>
{
    public void Configure(EntityTypeBuilder<ProductCatalog> builder)
    {
        builder.ToTable("product_catalog");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");
        builder.Property(c => c.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);

        builder.Property(c => c.Code).HasColumnName("code").HasMaxLength(25).IsRequired();
        builder.Property(c => c.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(c => c.Description).HasColumnName("description");
        builder.Property(c => c.ValidFrom).HasColumnName("valid_from").HasColumnType("date").IsRequired();
        builder.Property(c => c.ValidUntil).HasColumnName("valid_until").HasColumnType("date").IsRequired();
        builder.Property(c => c.PriceCode).HasColumnName("price_code").HasMaxLength(50);

        builder.Property(c => c.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(c => c.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(c => c.UpdatedBy).HasColumnName("updated_by");
        builder.Property(c => c.UpdatedAt).HasColumnName("updated_at");
        builder.Property(c => c.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(c => c.DeletedBy).HasColumnName("deleted_by");
        builder.Property(c => c.DeletedAt).HasColumnName("deleted_at");

        builder.HasIndex(c => c.Code).IsUnique().HasFilter("is_deleted = FALSE");
    }
}
