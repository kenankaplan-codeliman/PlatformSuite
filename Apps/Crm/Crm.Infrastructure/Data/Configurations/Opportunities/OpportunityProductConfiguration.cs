using Crm.Domain.Entities.Opportunities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Opportunities;

public class OpportunityProductConfiguration : IEntityTypeConfiguration<OpportunityProduct>
{
    public void Configure(EntityTypeBuilder<OpportunityProduct> builder)
    {
        builder.ToTable("opportunity_product");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).HasColumnName("id");

        builder.Property(p => p.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.OpportunityId).HasColumnName("opportunity_id").IsRequired();
        builder.Property(p => p.ProductId).HasColumnName("product_id").IsRequired();

        builder.Property(p => p.Quantity)
            .HasColumnName("quantity")
            .HasPrecision(18, 4)
            .IsRequired();

        builder.Property(p => p.UnitPrice)
            .HasColumnName("unit_price")
            .HasPrecision(18, 2)
            .IsRequired();

        // Para birimi parent Opportunity'nin Currency'sinden gelir — line-level kolon yok.

        // GeneralParameter code (parentCode: ProductUnitOfMeasure). Ürün seçimi
        // sırasında Product.UnitOfMeasure'dan prefill edilir, satırda override edilebilir.
        builder.Property(p => p.UnitCode)
            .HasColumnName("unit_code")
            .HasMaxLength(50);

        // İndirim alanları — önce oran sonra tutar uygulanır (bkz. OpportunityProduct.NetAmount).
        builder.Property(p => p.DiscountRate)
            .HasColumnName("discount_rate")
            .HasPrecision(5, 2)
            .IsRequired()
            .HasDefaultValue(0m);

        builder.Property(p => p.DiscountAmount)
            .HasColumnName("discount_amount")
            .HasPrecision(18, 2)
            .IsRequired()
            .HasDefaultValue(0m);

        // LineTotal / LineDiscountRateAmount / LineDiscountTotal / NetAmount app/DTO'da hesaplanır — DB sütunu değil.
        builder.Ignore(p => p.LineTotal);
        builder.Ignore(p => p.LineDiscountRateAmount);
        builder.Ignore(p => p.LineDiscountTotal);
        builder.Ignore(p => p.NetAmount);

        // Product silinmesi line item'ları cascade etmesin (tarihsel fiyat snapshot'ı korunur).
        builder.HasOne(p => p.Product)
            .WithMany()
            .HasForeignKey(p => p.ProductId)
            .HasConstraintName("fk_opportunity_product_product")
            .OnDelete(DeleteBehavior.Restrict);

        // Audit
        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(p => p.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(p => p.DeletedBy).HasColumnName("deleted_by");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");

        builder.HasIndex(p => p.OpportunityId).HasDatabaseName("ix_opportunity_product_opportunity");
    }
}
