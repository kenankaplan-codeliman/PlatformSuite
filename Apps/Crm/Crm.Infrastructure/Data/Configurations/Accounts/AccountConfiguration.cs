using Crm.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Accounts;

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("account");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasColumnName("id");

        builder.Property(a => a.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true)
            ;

        builder.Property(a => a.AccountName)
            .HasColumnName("account_name")
            .IsRequired()
            .HasMaxLength(250);

        // AccountType / AccountStatus: GeneralParameter'a taşındı — düz string code
        // olarak tutulur (geçerlilik handler'da IGeneralParameterReader ile doğrulanır).
        builder.Property(a => a.AccountType)
            .HasColumnName("account_type")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.AccountStatus)
            .HasColumnName("account_status")
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Prospect");

        builder.Property(a => a.Industry)
            .HasColumnName("industry")
            .HasMaxLength(150);

        builder.Property(a => a.AnnualRevenue)
            .HasColumnName("annual_revenue")
            .HasPrecision(18, 2);

        builder.Property(a => a.NumberOfEmployees)
            .HasColumnName("number_of_employees");

        builder.Property(a => a.Website)
            .HasColumnName("website")
            .HasMaxLength(250);

        builder.Property(a => a.Description)
            .HasColumnName("description")
            .HasColumnType("text");

        // Self-referencing
        builder.Property(a => a.ParentAccountId)
            .HasColumnName("parent_account_id");

        builder.HasOne(a => a.ParentAccount)
            .WithMany(a => a.ChildAccounts)
            .HasForeignKey(a => a.ParentAccountId)
            .HasConstraintName("fk_account_parent")
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);

        // Owner
        builder.Property(a => a.OwnerId)
            .HasColumnName("owner_id")
            .IsRequired();

        builder.Property(a => a.OrganizationId)
            .HasColumnName("organization_id")
            .IsRequired();

        // Audit
        builder.Property(a => a.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(a => a.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(a => a.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(a => a.UpdatedAt)
            .HasColumnName("updated_at");

        // Soft Delete
        builder.Property(a => a.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false)
            ;

        builder.Property(a => a.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(a => a.DeletedAt)
            .HasColumnName("deleted_at");

        // Relationships
        builder.HasMany(a => a.Emails)
            .WithOne(e => e.Account)
            .HasForeignKey(e => e.AccountId)
            .HasConstraintName("fk_account_email")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Phones)
            .WithOne(p => p.Account)
            .HasForeignKey(p => p.AccountId)
            .HasConstraintName("fk_account_phone")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Addresses)
            .WithOne(ad => ad.Account)
            .HasForeignKey(ad => ad.AccountId)
            .HasConstraintName("fk_account_address")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.AccountContacts)
            .WithOne(ac => ac.Account)
            .HasForeignKey(ac => ac.AccountId)
            .HasConstraintName("fk_ac_account")
            .OnDelete(DeleteBehavior.Cascade);

    }
}
