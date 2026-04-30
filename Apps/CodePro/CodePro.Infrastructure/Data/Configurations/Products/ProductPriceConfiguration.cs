using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductPriceConfiguration : IEntityTypeConfiguration<ProductPrice>
{
    public void Configure(EntityTypeBuilder<ProductPrice> builder)
    {
        builder.ToTable("product_price");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);

        builder.Property(p => p.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(p => p.SupplierAccountId).HasColumnName("supplier_account_id").IsRequired();
        builder.Property(p => p.PriceListId).HasColumnName("price_list_id");

        builder.Property(p => p.MinimumQuantity).HasColumnName("minimum_quantity").HasColumnType("numeric(18,4)").IsRequired();
        builder.Property(p => p.ValidFrom).HasColumnName("valid_from").IsRequired();
        builder.Property(p => p.ValidUntil).HasColumnName("valid_until").IsRequired();
        builder.Property(p => p.UnitPrice).HasColumnName("unit_price").HasColumnType("numeric(18,4)").IsRequired();
        builder.Property(p => p.Currency).HasColumnName("currency").IsRequired().HasMaxLength(3);

        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");
        builder.Property(p => p.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(p => p.DeletedBy).HasColumnName("deleted_by");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(p => p.Product)
            .WithMany()
            .HasForeignKey(p => p.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.SupplierAccount)
            .WithMany()
            .HasForeignKey(p => p.SupplierAccountId)
            .OnDelete(DeleteBehavior.Restrict);

        // PriceList tarafında HasMany ile tanımlandı

        builder.HasIndex(p => new { p.ProductId, p.SupplierAccountId, p.ValidFrom, p.ValidUntil });
    }
}
