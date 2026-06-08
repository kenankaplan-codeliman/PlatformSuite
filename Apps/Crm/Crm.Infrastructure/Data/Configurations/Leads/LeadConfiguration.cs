using Crm.Domain.Entities.Leads;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Leads;

public class LeadConfiguration : IEntityTypeConfiguration<Lead>
{
    public void Configure(EntityTypeBuilder<Lead> builder)
    {
        builder.ToTable("lead");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Id).HasColumnName("id");

        builder.Property(l => l.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(l => l.Subject)
            .HasColumnName("subject")
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(l => l.FirstName).HasColumnName("first_name").HasMaxLength(100);
        builder.Property(l => l.LastName).HasColumnName("last_name").HasMaxLength(100);
        builder.Property(l => l.Title).HasColumnName("title").HasMaxLength(150);
        builder.Property(l => l.Department).HasColumnName("department").HasMaxLength(200);
        builder.Property(l => l.Company).HasColumnName("company").HasMaxLength(250);
        builder.Property(l => l.Industry).HasColumnName("industry").HasMaxLength(150);
        builder.Property(l => l.Website).HasColumnName("website").HasMaxLength(250);

        // Email/Phone düz alanları kaldırıldı — Communications (email_address/phone) tablolarına taşındı.

        // Source / Status: GeneralParameter'a taşındı — düz string code olarak
        // tutulur (geçerlilik handler'da IGeneralParameterReader ile doğrulanır).
        builder.Property(l => l.Source)
            .HasColumnName("source")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(l => l.Status)
            .HasColumnName("status")
            .IsRequired()
            .HasMaxLength(50);

        // Rating: GeneralParameter code (LeadRating) — opsiyonel, düz string.
        builder.Property(l => l.Rating).HasColumnName("rating").HasMaxLength(50);

        builder.Property(l => l.Score).HasColumnName("score");
        builder.Property(l => l.EstimatedValue).HasColumnName("estimated_value").HasPrecision(18, 2);
        // EstimatedValue para birimi: GeneralParameter code (CurrencyType) — düz string.
        builder.Property(l => l.EstimatedValueCurrency).HasColumnName("estimated_value_currency").HasMaxLength(10);
        builder.Property(l => l.Description).HasColumnName("description").HasColumnType("text");

        builder.Property(l => l.ConvertedAccountId).HasColumnName("converted_account_id");
        builder.Property(l => l.ConvertedContactId).HasColumnName("converted_contact_id");
        builder.Property(l => l.ConvertedAt).HasColumnName("converted_at");

        builder.HasOne(l => l.ConvertedAccount)
            .WithMany()
            .HasForeignKey(l => l.ConvertedAccountId)
            .HasConstraintName("fk_lead_converted_account")
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        builder.HasOne(l => l.ConvertedContact)
            .WithMany()
            .HasForeignKey(l => l.ConvertedContactId)
            .HasConstraintName("fk_lead_converted_contact")
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        // Owner
        builder.Property(l => l.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(l => l.OrganizationId).HasColumnName("organization_id").IsRequired();

        // Audit
        builder.Property(l => l.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(l => l.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(l => l.UpdatedBy).HasColumnName("updated_by");
        builder.Property(l => l.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(l => l.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(l => l.DeletedBy).HasColumnName("deleted_by");
        builder.Property(l => l.DeletedAt).HasColumnName("deleted_at");

        builder.HasIndex(l => l.Status).HasDatabaseName("ix_lead_status");
        builder.HasIndex(l => l.OwnerId).HasDatabaseName("ix_lead_owner");
    }
}
