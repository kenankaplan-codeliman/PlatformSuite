using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.ToTable("brand");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id).HasColumnName("id");
        builder.Property(b => b.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
        builder.Property(b => b.Name).HasColumnName("name").IsRequired().HasMaxLength(100);
        builder.HasIndex(b => b.Name).IsUnique().HasFilter("is_deleted = FALSE");
        builder.Property(b => b.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(b => b.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(b => b.UpdatedBy).HasColumnName("updated_by");
        builder.Property(b => b.UpdatedAt).HasColumnName("updated_at");
        builder.Property(b => b.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(b => b.DeletedBy).HasColumnName("deleted_by");
        builder.Property(b => b.DeletedAt).HasColumnName("deleted_at");
    }
}
