using CRM.Domain.Entities.Leads;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CRM.Infrastructure.Data.Configurations.Leads;

public class LeadConfiguration : IEntityTypeConfiguration<Lead>
{
    public void Configure(EntityTypeBuilder<Lead> builder)
    {
        builder.ToTable("lead");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.CompanyName)
            .HasColumnName("company_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.JobTitle)
            .HasColumnName("job_title")
            .HasMaxLength(100);

        builder.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(150);

        builder.Property(e => e.Phone)
            .HasColumnName("phone")
            .HasMaxLength(50);

        builder.Property(e => e.MobilePhone)
            .HasColumnName("mobile_phone")
            .HasMaxLength(50);

        builder.Property(e => e.Website)
            .HasColumnName("website")
            .HasMaxLength(200);

        builder.Property(e => e.Industry)
            .HasColumnName("industry")
            .HasMaxLength(150);

        builder.Property(e => e.NumberOfEmployees)
            .HasColumnName("number_of_employees");

        builder.Property(e => e.AnnualRevenue)
            .HasColumnName("annual_revenue");

        builder.Property(e => e.EstimatedValue)
            .HasColumnName("estimated_value");

        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(1000);

        builder.Property(e => e.Address)
            .HasColumnName("address")
            .HasMaxLength(1000);

        builder.Property(e => e.ConvertedDate)
            .HasColumnName("converted_date");

        builder.Property(e => e.ConvertedAccountId)
            .HasColumnName("converted_account_id");

        builder.Property(e => e.ConvertedContactId)
            .HasColumnName("converted_contact_id");

        builder.Property(e => e.ConvertedOpportunityId)
            .HasColumnName("converted_opportunity_id");

        builder.Property(e => e.LeadSource)
            .HasColumnName("lead_source")
            .HasMaxLength(50)
            .IsRequired()
            .HasConversion<EnumToStringConverter<LeadSource>>();

        builder.Property(e => e.LeadStatus)
            .HasColumnName("lead_status")
            .HasMaxLength(50)
            .IsRequired()
            .HasConversion<EnumToStringConverter<LeadStatus>>();

        builder.Property(e => e.LeadRating)
            .HasColumnName("lead_rating")
            .HasMaxLength(50)
            .IsRequired()
            .HasConversion<EnumToStringConverter<LeadRating>>();

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired();

        // Multi Tenant
        builder.Property(e => e.OwnerId)
            .HasColumnName("owner_id")
            .IsRequired();

        builder.Property(e => e.OrganizationId)
            .HasColumnName("organization_id")
            .IsRequired();

        // Audit
        builder.Property(e => e.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(e => e.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at");

        // Soft Delete
        builder.Property(e => e.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.Property(e => e.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

    }
}
