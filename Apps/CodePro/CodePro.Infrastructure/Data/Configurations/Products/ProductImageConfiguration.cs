using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.ToTable("product_image");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Id).HasColumnName("id");

        builder.Property(i => i.ProductId).HasColumnName("product_id").IsRequired();

        builder.Property(i => i.FileName).HasColumnName("file_name").IsRequired().HasMaxLength(500);
        builder.Property(i => i.ContentType).HasColumnName("content_type").IsRequired().HasMaxLength(200);
        builder.Property(i => i.FileSize).HasColumnName("file_size").IsRequired();
        builder.Property(i => i.ImageBytes).HasColumnName("image_bytes").IsRequired().HasColumnType("bytea");
        builder.Property(i => i.ThumbnailBytes).HasColumnName("thumbnail_bytes").IsRequired().HasColumnType("bytea");

        builder.Property(i => i.SortOrder).HasColumnName("sort_order").IsRequired().HasDefaultValue(0);
        builder.Property(i => i.IsDefault).HasColumnName("is_default").IsRequired().HasDefaultValue(false);

        builder.Property(i => i.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(i => i.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(i => i.UpdatedBy).HasColumnName("updated_by");
        builder.Property(i => i.UpdatedAt).HasColumnName("updated_at");
        builder.Property(i => i.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(i => i.DeletedBy).HasColumnName("deleted_by");
        builder.Property(i => i.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(i => i.Product)
            .WithMany()
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
