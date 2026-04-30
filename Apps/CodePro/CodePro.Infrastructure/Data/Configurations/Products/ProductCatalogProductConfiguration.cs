using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductCatalogProductConfiguration : IEntityTypeConfiguration<ProductCatalogProduct>
{
    public void Configure(EntityTypeBuilder<ProductCatalogProduct> builder)
    {
        builder.ToTable("product_catalog_product");
        builder.HasKey(cp => new { cp.ProductCatalogId, cp.ProductId });
        builder.Property(cp => cp.ProductCatalogId).HasColumnName("product_catalog_id");
        builder.Property(cp => cp.ProductId).HasColumnName("product_id");

        builder.HasOne(cp => cp.ProductCatalog)
            .WithMany(c => c.CatalogProducts)
            .HasForeignKey(cp => cp.ProductCatalogId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(cp => cp.Product)
            .WithMany()
            .HasForeignKey(cp => cp.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
