using CodePro.Domain.Entities.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Products;

public class ProductCatalogOrganizationConfiguration : IEntityTypeConfiguration<ProductCatalogOrganization>
{
    public void Configure(EntityTypeBuilder<ProductCatalogOrganization> builder)
    {
        builder.ToTable("product_catalog_organization");
        builder.HasKey(co => new { co.ProductCatalogId, co.AppOrganizationId });
        builder.Property(co => co.ProductCatalogId).HasColumnName("product_catalog_id");
        builder.Property(co => co.AppOrganizationId).HasColumnName("app_organization_id");

        builder.HasOne(co => co.ProductCatalog)
            .WithMany(c => c.CatalogOrganizations)
            .HasForeignKey(co => co.ProductCatalogId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(co => co.Organization)
            .WithMany()
            .HasForeignKey(co => co.AppOrganizationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
