using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("product");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);

        builder.Property(p => p.Code).HasColumnName("code").IsRequired().HasMaxLength(25);
        builder.HasIndex(p => p.Code).IsUnique().HasFilter("is_deleted = FALSE");

        builder.Property(p => p.Name).HasColumnName("name").IsRequired().HasMaxLength(50);
        builder.Property(p => p.ShortDescription).HasColumnName("short_description").IsRequired().HasMaxLength(50);
        builder.Property(p => p.DetailedDescription).HasColumnName("detailed_description").HasColumnType("text");

        builder.Property(p => p.ValidFrom).HasColumnName("valid_from").IsRequired();
        builder.Property(p => p.ValidUntil).HasColumnName("valid_until").IsRequired();

        builder.Property(p => p.UnitOfMeasure).HasColumnName("unit_of_measure").HasMaxLength(50);
        builder.Property(p => p.ManufacturerPartNumber).HasColumnName("manufacturer_part_number").HasMaxLength(25);
        builder.Property(p => p.Model).HasColumnName("model").HasMaxLength(25);
        builder.Property(p => p.Color).HasColumnName("color").HasMaxLength(25);
        builder.Property(p => p.ProductUrl).HasColumnName("product_url").HasColumnType("text");
        builder.Property(p => p.QuantityPerUnit).HasColumnName("quantity_per_unit");
        builder.Property(p => p.DeliveryDays).HasColumnName("delivery_days").IsRequired();
        builder.Property(p => p.AccountCodeId).HasColumnName("account_code_id");

        builder.Property(p => p.ProductCategoryId).HasColumnName("product_category_id").IsRequired();

        builder.HasOne(p => p.ProductCategory)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.ProductCategoryId);

        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");
        builder.Property(p => p.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(p => p.DeletedBy).HasColumnName("deleted_by");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");
    }
}
