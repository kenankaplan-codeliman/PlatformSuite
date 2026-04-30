using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductSkuConfiguration : IEntityTypeConfiguration<ProductSku>
{
    public void Configure(EntityTypeBuilder<ProductSku> builder)
    {
        builder.ToTable("product_sku");
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(s => s.SupplierAccountId).HasColumnName("supplier_account_id").IsRequired();
        builder.Property(s => s.Sku).HasColumnName("sku").IsRequired().HasMaxLength(25);

        builder.HasIndex(s => new { s.ProductId, s.SupplierAccountId }).IsUnique();

        builder.HasOne(s => s.Product)
            .WithMany(p => p.SupplierSkus)
            .HasForeignKey(s => s.ProductId);

        // Platform Account'ta ProductSkus collection'ı yok; reverse navigation kapalı.
        builder.HasOne(s => s.SupplierAccount)
            .WithMany()
            .HasForeignKey(s => s.SupplierAccountId);
    }
}
