using CodePro.Domain.Entities.PurchaseRequests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.PurchaseRequests;

public class PurchaseRequestLineConfiguration : IEntityTypeConfiguration<PurchaseRequestLine>
{
    public void Configure(EntityTypeBuilder<PurchaseRequestLine> builder)
    {
        builder.ToTable("purchase_request_line");
        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id).HasColumnName("id");
        builder.Property(l => l.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(l => l.PurchaseRequestId).HasColumnName("purchase_request_id").IsRequired();
        builder.Property(l => l.IsFreeProduct).HasColumnName("is_free_product").IsRequired().HasDefaultValue(false);
        builder.Property(l => l.ProductId).HasColumnName("product_id");
        builder.Property(l => l.ProductName).HasColumnName("product_name").HasMaxLength(100);
        builder.Property(l => l.ProductPriceId).HasColumnName("product_price_id");
        builder.Property(l => l.SupplierAccountId).HasColumnName("supplier_account_id");
        builder.Property(l => l.Quantity).HasColumnName("quantity").HasColumnType("numeric(18,3)").IsRequired();
        builder.Property(l => l.UnitOfMeasure).HasColumnName("unit_of_measure").HasMaxLength(25);
        builder.Property(l => l.UnitPrice).HasColumnName("unit_price").HasColumnType("numeric(18,4)");
        builder.Property(l => l.Currency).HasColumnName("currency").HasMaxLength(3);
        builder.Property(l => l.TotalAmount).HasColumnName("total_amount").HasColumnType("numeric(18,2)").IsRequired().HasDefaultValue(0m);
        builder.Property(l => l.NeedByDate).HasColumnName("need_by_date");
        builder.Property(l => l.BuyerNotes).HasColumnName("buyer_notes").HasMaxLength(255);
        builder.Property(l => l.Status).HasColumnName("status").IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(l => l.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(l => l.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(l => l.UpdatedBy).HasColumnName("updated_by");
        builder.Property(l => l.UpdatedAt).HasColumnName("updated_at");
        builder.Property(l => l.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        builder.Property(l => l.DeletedBy).HasColumnName("deleted_by");
        builder.Property(l => l.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(l => l.Product)
            .WithMany()
            .HasForeignKey(l => l.ProductId)
            .HasConstraintName("fk_purchase_request_line_product")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(l => l.ProductPrice)
            .WithMany()
            .HasForeignKey(l => l.ProductPriceId)
            .HasConstraintName("fk_purchase_request_line_product_price")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(l => l.SupplierAccount)
            .WithMany()
            .HasForeignKey(l => l.SupplierAccountId)
            .HasConstraintName("fk_purchase_request_line_supplier_account")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
