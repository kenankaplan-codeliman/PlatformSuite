using CRM.Domain.Entities.Lead;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CRM.Infrastructure.Data.Configurations.Modal;

public static class LeadEntities
{
    public static void ConfigureLeadEntities(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lead>(entity =>
        {
            entity.ToTable("lead");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.CompanyName)
                .HasColumnName("company_name")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.FirstName)
                .HasColumnName("first_name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.LastName)
                .HasColumnName("last_name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.JobTitle)
                .HasColumnName("job_title")
                .HasMaxLength(100);

            entity.Property(e => e.Email)
                .HasColumnName("email")
                .HasMaxLength(150);

            entity.Property(e => e.Phone)
                .HasColumnName("phone")
                .HasMaxLength(50);

            entity.Property(e => e.MobilePhone)
                .HasColumnName("mobile_phone")
                .HasMaxLength(50);

            entity.Property(e => e.Website)
                .HasColumnName("website")
                .HasMaxLength(200);

            entity.Property(e => e.Industry)
                .HasColumnName("industry")
                .HasMaxLength(150);

            entity.Property(e => e.NumberOfEmployees)
                .HasColumnName("number_of_employees");

            entity.Property(e => e.AnnualRevenue)
                .HasColumnName("annual_revenue");

            entity.Property(e => e.EstimatedValue)
                .HasColumnName("estimated_value");

            entity.Property(e => e.Description)
                .HasColumnName("description")
                .HasMaxLength(1000);

            entity.Property(e => e.Address)
                .HasColumnName("address")
                .HasMaxLength(1000);

            entity.Property(e => e.ConvertedDate)
                .HasColumnName("converted_date");

            entity.Property(e => e.ConvertedAccountId)
                .HasColumnName("converted_account_id");

            entity.Property(e => e.ConvertedContactId)
                .HasColumnName("converted_contact_id");

            entity.Property(e => e.ConvertedOpportunityId)
                .HasColumnName("converted_opportunity_id");

            entity.Property(e => e.LeadSource)
                .HasColumnName("lead_source")
                .HasMaxLength(50)
                .IsRequired()
                .HasConversion<EnumToStringConverter<LeadSource>>();

            entity.Property(e => e.LeadStatus)
                .HasColumnName("lead_status")
                .HasMaxLength(50)
                .IsRequired()
                .HasConversion<EnumToStringConverter<LeadStatus>>();

            entity.Property(e => e.LeadRating)
                .HasColumnName("lead_rating")
                .HasMaxLength(50)
                .IsRequired()
                .HasConversion<EnumToStringConverter<LeadRating>>();

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .HasColumnName("is_deleted")
                .IsRequired();

            entity.Property(e => e.DeletedBy)
                .HasColumnName("deleted_by");

            entity.Property(e => e.DeletedAt)
                .HasColumnName("deleted_at");

            entity.Property(e => e.OwnerId)
                .HasColumnName("owner_id")
                .IsRequired();

            entity.Property(e => e.OrganizationId)
                .HasColumnName("organization_id")
                .IsRequired();
        });
    }
}
