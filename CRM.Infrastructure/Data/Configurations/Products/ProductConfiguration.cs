using CRM.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRM.Infrastructure.Data.Configurations.Products;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("product");

        // Primary Key
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        // Properties
        builder.Property(x => x.Name)
            .HasColumnName("name")
            .HasMaxLength(250)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasColumnName("description");

        builder.Property(x => x.SKU)
            .HasColumnName("sku")
            .HasMaxLength(100);

        builder.HasIndex(x => x.SKU)
            .IsUnique()
            .HasDatabaseName("uq_product_sku")
            .HasFilter("sku IS NOT NULL");

        builder.Property(x => x.Category)
            .HasColumnName("category")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(x => x.UnitPrice)
            .HasColumnName("unit_price")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.Currency)
            .HasColumnName("currency")
            .HasMaxLength(3)
            .IsRequired()
            .HasDefaultValue("TRY");

        builder.Property(x => x.Unit)
            .HasColumnName("unit")
            .HasMaxLength(50);

        // IBaseEntity
        builder.Property(x => x.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        // IAuditableEntity
        builder.Property(x => x.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at");

        // ISoftDeleteEntity
        builder.Property(x => x.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(x => x.DeletedAt)
            .HasColumnName("deleted_at");

        // Relationships
        builder.HasMany(x => x.OpportunityProducts)
            .WithOne(x => x.Product)
            .HasForeignKey(x => x.ProductId)
            .HasConstraintName("fk_product_opportunity_product")
            .OnDelete(DeleteBehavior.Restrict);
    }
}