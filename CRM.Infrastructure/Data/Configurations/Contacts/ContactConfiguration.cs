using CRM.Domain.Entities.Contacts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRM.Persistence.Configurations.Contacts;

public class ContactConfiguration : IEntityTypeConfiguration<Contact>
{
    public void Configure(EntityTypeBuilder<Contact> builder)
    {
        builder.ToTable("contact");

        // Primary Key
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            ;

        // Properties
        builder.Property(x => x.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(x => x.LastName)
            .HasColumnName("last_name")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(x => x.Title)
            .HasColumnName("title")
            .HasMaxLength(150);

        builder.Property(x => x.Department)
            .HasColumnName("department")
            .HasMaxLength(150);

        builder.Property(x => x.BirthDate)
            .HasColumnName("birth_date");

        builder.Property(x => x.Description)
            .HasColumnName("description");

        // IOwnedEntity
        builder.Property(x => x.OwnerId)
            .HasColumnName("owner_id")
            .IsRequired();

        builder.Property(x => x.OrganizationId)
            .HasColumnName("organization_id")
            .IsRequired();

        // IBaseEntity
        builder.Property(x => x.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true)
            ;

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
            .HasDefaultValue(false)
            ;

        builder.Property(x => x.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(x => x.DeletedAt)
            .HasColumnName("deleted_at");

        // Relationships
        builder.HasMany(x => x.Emails)
            .WithOne(x => x.Contact)
            .HasForeignKey(x => x.ContactId)
            .HasConstraintName("fk_contact_email")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Phones)
            .WithOne(x => x.Contact)
            .HasForeignKey(x => x.ContactId)
            .HasConstraintName("fk_contact_phone")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Addresses)
            .WithOne(x => x.Contact)
            .HasForeignKey(x => x.ContactId)
            .HasConstraintName("fk_contact_address")
            .OnDelete(DeleteBehavior.Cascade);

        
        builder.HasMany(a => a.AccountContacts)
            .WithOne(ac => ac.Contact)
            .HasForeignKey(ac => ac.ContactId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignored computed properties
        builder.Ignore(e => e.DisplayName);
    }
}
