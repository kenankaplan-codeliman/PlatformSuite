using CodePro.Domain.Entities.PurchaseBaskets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.PurchaseBaskets;

public class PurchaseBasketLineConfiguration : IEntityTypeConfiguration<PurchaseBasketLine>
{
    public void Configure(EntityTypeBuilder<PurchaseBasketLine> builder)
    {
        builder.ToTable("purchase_basket_line");
        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id).HasColumnName("id");

        builder.Property(l => l.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(l => l.PurchaseBasketId).HasColumnName("purchase_basket_id").IsRequired();
        builder.Property(l => l.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(l => l.Quantity).HasColumnName("quantity").IsRequired();

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
            .HasConstraintName("fk_purchase_basket_line_product")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
