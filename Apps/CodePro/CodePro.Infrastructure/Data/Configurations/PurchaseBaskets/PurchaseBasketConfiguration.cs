using CodePro.Domain.Entities.PurchaseBaskets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.PurchaseBaskets;

public class PurchaseBasketConfiguration : IEntityTypeConfiguration<PurchaseBasket>
{
    public void Configure(EntityTypeBuilder<PurchaseBasket> builder)
    {
        builder.ToTable("purchase_basket");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id).HasColumnName("id");

        builder.Property(b => b.Status)
            .HasColumnName("status")
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(b => b.PurchaseRequestId).HasColumnName("purchase_request_id");

        builder.Property(b => b.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);

        builder.Property(b => b.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(b => b.OrganizationId).HasColumnName("organization_id").IsRequired();

        builder.Property(b => b.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(b => b.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(b => b.UpdatedBy).HasColumnName("updated_by");
        builder.Property(b => b.UpdatedAt).HasColumnName("updated_at");

        builder.Property(b => b.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(b => b.DeletedBy).HasColumnName("deleted_by");
        builder.Property(b => b.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(b => b.PurchaseRequest)
            .WithMany()
            .HasForeignKey(b => b.PurchaseRequestId)
            .HasConstraintName("fk_purchase_basket_purchase_request")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.Lines)
            .WithOne(l => l.PurchaseBasket)
            .HasForeignKey(l => l.PurchaseBasketId)
            .HasConstraintName("fk_purchase_basket_line_basket")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
