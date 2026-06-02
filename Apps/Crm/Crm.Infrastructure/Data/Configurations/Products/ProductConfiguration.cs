using Crm.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Products;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("product");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).HasColumnName("id");

        builder.Property(p => p.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(p => p.Name)
            .HasColumnName("name")
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(p => p.ProductCode)
            .HasColumnName("product_code")
            .IsRequired()
            .HasMaxLength(50);

        // Category / UnitOfMeasure: GeneralParameter code — düz string
        // (geçerlilik handler'da IGeneralParameterReader ile doğrulanır).
        builder.Property(p => p.Category)
            .HasColumnName("category")
            .HasMaxLength(50);

        builder.Property(p => p.UnitPrice)
            .HasColumnName("unit_price")
            .HasPrecision(18, 2);

        // UnitPrice para birimi: GeneralParameter code (CurrencyType) — düz string.
        builder.Property(p => p.UnitPriceCurrency)
            .HasColumnName("unit_price_currency")
            .HasMaxLength(10);

        builder.Property(p => p.UnitOfMeasure)
            .HasColumnName("unit_of_measure")
            .HasMaxLength(50);

        builder.Property(p => p.Description)
            .HasColumnName("description")
            .HasColumnType("text");

        // Owner
        builder.Property(p => p.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(p => p.OrganizationId).HasColumnName("organization_id").IsRequired();

        // Audit
        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(p => p.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(p => p.DeletedBy).HasColumnName("deleted_by");
        builder.Property(p => p.DeletedAt).HasColumnName("deleted_at");

        // Benzersiz ürün kodu — soft-delete edilmemiş satırlar arasında.
        builder.HasIndex(p => p.ProductCode)
            .HasDatabaseName("ix_product_code_unique")
            .IsUnique()
            .HasFilter("is_deleted = false");

        builder.HasIndex(p => p.OwnerId).HasDatabaseName("ix_product_owner");
        builder.HasIndex(p => p.OrganizationId).HasDatabaseName("ix_product_organization");
    }
}
