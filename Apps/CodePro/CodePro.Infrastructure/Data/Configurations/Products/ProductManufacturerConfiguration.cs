using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductManufacturerConfiguration : IEntityTypeConfiguration<ProductManufacturer>
{
    public void Configure(EntityTypeBuilder<ProductManufacturer> builder)
    {
        builder.ToTable("product_manufacturer");
        builder.HasKey(pm => new { pm.ProductId, pm.ManufacturerId });
        builder.Property(pm => pm.ProductId).HasColumnName("product_id");
        builder.Property(pm => pm.ManufacturerId).HasColumnName("manufacturer_id");

        builder.HasOne(pm => pm.Product)
            .WithMany(p => p.ProductManufacturers)
            .HasForeignKey(pm => pm.ProductId);

        builder.HasOne(pm => pm.Manufacturer)
            .WithMany(m => m.ProductManufacturers)
            .HasForeignKey(pm => pm.ManufacturerId);
    }
}
