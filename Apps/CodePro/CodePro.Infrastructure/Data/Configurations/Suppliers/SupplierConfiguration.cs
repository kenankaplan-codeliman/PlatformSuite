using CodePro.Domain.Entities.Suppliers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Suppliers;

public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.ToTable("supplier");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");

        builder.Property(s => s.Name)
            .HasColumnName("name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(s => s.Industry).HasColumnName("industry").HasMaxLength(120);
        builder.Property(s => s.Website).HasColumnName("website").HasMaxLength(255);
        builder.Property(s => s.Description).HasColumnName("description");
        builder.Property(s => s.AnnualRevenue).HasColumnName("annual_revenue").HasColumnType("numeric(18,2)");
        builder.Property(s => s.NumberOfEmployees).HasColumnName("number_of_employees");

        builder.Property(s => s.SupplierType)
            .HasColumnName("supplier_type")
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(s => s.SupplierStatus)
            .HasColumnName("supplier_status")
            .HasConversion<string>()
            .HasMaxLength(20)
            .HasDefaultValue(CodePro.Domain.Enums.SupplierStatus.Pending);

        builder.Property(s => s.CompanyType)
            .HasColumnName("company_type")
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(s => s.CompanyLegalType)
            .HasColumnName("company_legal_type")
            .HasConversion<string?>()
            .HasMaxLength(50);

        builder.Property(s => s.TaxOffice).HasColumnName("tax_office").HasMaxLength(150);
        builder.Property(s => s.Vkn).HasColumnName("vkn").HasMaxLength(20);
        builder.Property(s => s.MersisNo).HasColumnName("mersis_no").HasMaxLength(20);

        builder.Property(s => s.ContactPersonName).HasColumnName("contact_person_name").HasMaxLength(150);
        builder.Property(s => s.ContactPersonEmail).HasColumnName("contact_person_email").HasMaxLength(255);
        builder.Property(s => s.ContactPersonPhone).HasColumnName("contact_person_phone").HasMaxLength(50);

        builder.Property(s => s.AddressLine).HasColumnName("address_line").HasMaxLength(500);
        builder.Property(s => s.City).HasColumnName("city").HasMaxLength(120);
        builder.Property(s => s.Country).HasColumnName("country").HasMaxLength(120);
        builder.Property(s => s.PostalCode).HasColumnName("postal_code").HasMaxLength(20);

        builder.Property(s => s.IsActive).HasColumnName("is_active");
        builder.Property(s => s.OwnerId).HasColumnName("owner_id");
        builder.Property(s => s.OrganizationId).HasColumnName("organization_id");
        builder.Property(s => s.CreatedBy).HasColumnName("created_by");
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");
        builder.Property(s => s.UpdatedBy).HasColumnName("updated_by");
        builder.Property(s => s.UpdatedAt).HasColumnName("updated_at");
        builder.Property(s => s.IsDeleted).HasColumnName("is_deleted");
        builder.Property(s => s.DeletedBy).HasColumnName("deleted_by");
        builder.Property(s => s.DeletedAt).HasColumnName("deleted_at");
    }
}
