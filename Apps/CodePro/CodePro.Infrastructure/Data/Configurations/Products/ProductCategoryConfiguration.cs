using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductCategoryConfiguration : IEntityTypeConfiguration<ProductCategory>
{
    public void Configure(EntityTypeBuilder<ProductCategory> builder)
    {
        builder.ToTable("product_category");
        builder.HasKey(pc => pc.Id);
        builder.Property(pc => pc.Id).HasColumnName("id");
        builder.Property(pc => pc.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
        builder.Property(pc => pc.Title).HasColumnName("title").IsRequired().HasMaxLength(500);
        builder.Property(pc => pc.Code).HasColumnName("code").HasMaxLength(20);
        builder.Property(pc => pc.Description).HasColumnName("description").HasColumnType("text");
        builder.Property(pc => pc.ParentCategoryId).HasColumnName("parent_category_id");
        builder.Property(pc => pc.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(pc => pc.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(pc => pc.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(pc => pc.UpdatedBy).HasColumnName("updated_by");
        builder.Property(pc => pc.UpdatedAt).HasColumnName("updated_at");
        builder.Property(pc => pc.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        builder.Property(pc => pc.DeletedBy).HasColumnName("deleted_by");
        builder.Property(pc => pc.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(pc => pc.ParentCategory)
            .WithMany(pc => pc.ChildCategories)
            .HasForeignKey(pc => pc.ParentCategoryId)
            .HasConstraintName("fk_product_category_parent")
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        builder.HasMany(pc => pc.Products)
            .WithOne(p => p.ProductCategory)
            .HasForeignKey(p => p.ProductCategoryId)
            .HasConstraintName("fk_product_product_category")
            .OnDelete(DeleteBehavior.Restrict);
    }
}
