using CodePro.Domain.Entities.PurchaseOrders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.PurchaseOrders;

public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.ToTable("purchase_order");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id).HasColumnName("id");
        builder.Property(o => o.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
        builder.Property(o => o.OrderNumber).HasColumnName("order_number").IsRequired().HasMaxLength(25);
        builder.Property(o => o.Title).HasColumnName("title").IsRequired().HasMaxLength(50);
        builder.Property(o => o.Description).HasColumnName("description").HasColumnType("text");
        builder.Property(o => o.SupplierId).HasColumnName("supplier_id").IsRequired();
        builder.Property(o => o.PurchaseRequestId).HasColumnName("purchase_request_id");
        builder.Property(o => o.Status).HasColumnName("status").IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(o => o.Priority).HasColumnName("priority").IsRequired().HasConversion<string>().HasMaxLength(10);
        builder.Property(o => o.OrderDate).HasColumnName("order_date").IsRequired();
        builder.Property(o => o.ExpectedDeliveryDate).HasColumnName("expected_delivery_date");
        builder.Property(o => o.CurrencyCode).HasColumnName("currency_code").HasMaxLength(3);
        builder.Property(o => o.TotalAmount).HasColumnName("total_amount").HasColumnType("numeric(18,2)").IsRequired().HasDefaultValue(0m);
        builder.Property(o => o.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(o => o.OrganizationId).HasColumnName("organization_id").IsRequired();
        builder.Property(o => o.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(o => o.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(o => o.UpdatedBy).HasColumnName("updated_by");
        builder.Property(o => o.UpdatedAt).HasColumnName("updated_at");
        builder.Property(o => o.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(o => o.DeletedBy).HasColumnName("deleted_by");
        builder.Property(o => o.DeletedAt).HasColumnName("deleted_at");

        builder.HasIndex(o => o.OrderNumber).IsUnique().HasDatabaseName("uq_purchase_order_number");

        builder.HasOne(o => o.Supplier)
            .WithMany()
            .HasForeignKey(o => o.SupplierId)
            .HasConstraintName("fk_purchase_order_supplier_account")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.PurchaseRequest)
            .WithMany()
            .HasForeignKey(o => o.PurchaseRequestId)
            .HasConstraintName("fk_purchase_order_request")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Lines)
            .WithOne(l => l.PurchaseOrder)
            .HasForeignKey(l => l.PurchaseOrderId)
            .HasConstraintName("fk_purchase_order_line_order")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
