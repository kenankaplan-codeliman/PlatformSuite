using CodePro.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Accounts;

/// <summary>
/// Supplier alt sınıfı için kolon mapping'i. TPH discriminator
/// <c>CodeProDbContext.OnModelCreating</c> içinde Account üzerinden kuruluyor;
/// burada sadece Supplier'a özgü kolonların DB karşılıkları tanımlanır.
/// </summary>
public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
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

        builder.Property(s => s.TaxOffice)
            .HasColumnName("tax_office")
            .HasMaxLength(150);

        builder.Property(s => s.Vkn)
            .HasColumnName("vkn")
            .HasMaxLength(20);

        builder.Property(s => s.MersisNo)
            .HasColumnName("mersis_no")
            .HasMaxLength(20);
    }
}
