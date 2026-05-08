using CodePro.Domain.Entities.Suppliers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Suppliers;

public class SupplierProductCategoryConfiguration : IEntityTypeConfiguration<SupplierProductCategory>
{
    public void Configure(EntityTypeBuilder<SupplierProductCategory> builder)
    {
        builder.ToTable("supplier_product_category");
        builder.HasKey(spc => spc.Id);
        builder.Property(spc => spc.Id).HasColumnName("id");
        builder.Property(spc => spc.SupplierId).HasColumnName("supplier_id").IsRequired();
        builder.Property(spc => spc.ProductCategoryId).HasColumnName("product_category_id").IsRequired();
        builder.Property(spc => spc.IsPreferred).HasColumnName("is_preferred").HasDefaultValue(false);
        builder.Property(spc => spc.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(spc => spc.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(spc => spc.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(spc => spc.UpdatedBy).HasColumnName("updated_by");
        builder.Property(spc => spc.UpdatedAt).HasColumnName("updated_at");
        builder.Property(spc => spc.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        builder.Property(spc => spc.DeletedBy).HasColumnName("deleted_by");
        builder.Property(spc => spc.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(spc => spc.Supplier)
            .WithMany(s => s.ProductCategories)
            .HasForeignKey(spc => spc.SupplierId)
            .HasConstraintName("fk_supplier_product_category_supplier")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(spc => spc.ProductCategory)
            .WithMany()
            .HasForeignKey(spc => spc.ProductCategoryId)
            .HasConstraintName("fk_supplier_product_category_category")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(spc => spc.SupplierId)
            .HasDatabaseName("idx_supplier_product_category_supplier");

        builder.HasIndex(spc => spc.ProductCategoryId)
            .HasDatabaseName("idx_supplier_product_category_category");

        builder.HasIndex(spc => new { spc.SupplierId, spc.ProductCategoryId })
            .IsUnique()
            .HasFilter("is_deleted = FALSE")
            .HasDatabaseName("uq_supplier_product_category");
    }
}
