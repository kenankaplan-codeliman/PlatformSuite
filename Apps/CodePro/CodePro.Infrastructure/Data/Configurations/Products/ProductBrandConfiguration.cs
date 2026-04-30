using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductBrandConfiguration : IEntityTypeConfiguration<ProductBrand>
{
    public void Configure(EntityTypeBuilder<ProductBrand> builder)
    {
        builder.ToTable("product_brand");
        builder.HasKey(pb => new { pb.ProductId, pb.BrandId });
        builder.Property(pb => pb.ProductId).HasColumnName("product_id");
        builder.Property(pb => pb.BrandId).HasColumnName("brand_id");

        builder.HasOne(pb => pb.Product)
            .WithMany(p => p.ProductBrands)
            .HasForeignKey(pb => pb.ProductId);

        builder.HasOne(pb => pb.Brand)
            .WithMany(b => b.ProductBrands)
            .HasForeignKey(pb => pb.BrandId);
    }
}
