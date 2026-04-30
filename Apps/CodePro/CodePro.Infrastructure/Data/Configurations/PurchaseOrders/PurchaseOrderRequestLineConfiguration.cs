using CodePro.Domain.Entities.PurchaseOrders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.PurchaseOrders;

public class PurchaseOrderRequestLineConfiguration : IEntityTypeConfiguration<PurchaseOrderRequestLine>
{
    public void Configure(EntityTypeBuilder<PurchaseOrderRequestLine> builder)
    {
        builder.ToTable("purchase_order_request_line");
        builder.HasKey(rl => rl.Id);
        builder.Property(rl => rl.Id).HasColumnName("id");
        builder.Property(rl => rl.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(rl => rl.PurchaseOrderLineId).HasColumnName("purchase_order_line_id").IsRequired();
        builder.Property(rl => rl.PurchaseRequestLineId).HasColumnName("purchase_request_line_id").IsRequired();
        builder.Property(rl => rl.AllocatedQuantity).HasColumnName("allocated_quantity").HasColumnType("numeric(18,3)").IsRequired();

        builder.HasOne(rl => rl.PurchaseRequestLine)
            .WithMany(prl => prl.OrderRequestLines)
            .HasForeignKey(rl => rl.PurchaseRequestLineId)
            .HasConstraintName("fk_po_request_line_request_line")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(rl => new { rl.PurchaseOrderLineId, rl.PurchaseRequestLineId })
            .IsUnique()
            .HasDatabaseName("uq_order_request_line");
    }
}
