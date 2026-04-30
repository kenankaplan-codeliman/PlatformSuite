using Platform.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Accounts;

public class AccountContactConfiguration : IEntityTypeConfiguration<AccountContact>
{
    public void Configure(EntityTypeBuilder<AccountContact> builder)
    {
        builder.ToTable("account_contact");

        builder.HasKey(ac => ac.Id);

        builder.Property(ac => ac.Id)
            .HasColumnName("id");

        builder.Property(ac => ac.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true)
            ;

        builder.Property(ac => ac.AccountId)
            .HasColumnName("account_id")
            .IsRequired();

        builder.Property(ac => ac.ContactId)
            .HasColumnName("contact_id")
            .IsRequired();

        builder.Property(ac => ac.Role)
            .HasColumnName("role")
            .HasMaxLength(150);

        builder.Property(ac => ac.IsPrimary)
            .HasColumnName("is_primary")
            .IsRequired()
            .HasDefaultValue(false)
            ;

        // Audit
        builder.Property(ac => ac.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(ac => ac.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(ac => ac.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(ac => ac.UpdatedAt)
            .HasColumnName("updated_at");

        // Soft Delete
        builder.Property(ac => ac.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false)
            ;

        builder.Property(ac => ac.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(ac => ac.DeletedAt)
            .HasColumnName("deleted_at");

        // Relationships
        builder.HasOne(ac => ac.Account)
            .WithMany(a => a.AccountContacts)
            .HasForeignKey(ac => ac.AccountId)
            .HasConstraintName("fk_ac_account")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ac => ac.Contact)
            .WithMany(c => c.AccountContacts)
            .HasForeignKey(ac => ac.ContactId)
            .HasConstraintName("fk_ac_contact")
            .OnDelete(DeleteBehavior.Cascade);
    }
}