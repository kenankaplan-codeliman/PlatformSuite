using CRM.Domain.Entities.Contacts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRM.Persistence.Configurations.Contacts;

public class ContactAddressConfiguration : IEntityTypeConfiguration<ContactAddress>
{
    public void Configure(EntityTypeBuilder<ContactAddress> builder)
    {
        builder.ToTable("contact_address");

        // Primary Key
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            ;

        // Properties
        builder.Property(x => x.ContactId)
            .HasColumnName("contact_id")
            .IsRequired();

        builder.Property(x => x.AddressLine1)
            .HasColumnName("address_line1")
            .HasMaxLength(250)
            .IsRequired();

        builder.Property(x => x.AddressLine2)
            .HasColumnName("address_line2")
            .HasMaxLength(250);

        builder.Property(x => x.City)
            .HasColumnName("city")
            .HasMaxLength(150);

        builder.Property(x => x.State)
            .HasColumnName("state")
            .HasMaxLength(150);

        builder.Property(x => x.PostalCode)
            .HasColumnName("postal_code")
            .HasMaxLength(50);

        builder.Property(x => x.Country)
            .HasColumnName("country")
            .HasMaxLength(150);

        builder.Property(x => x.Type)
            .HasColumnName("type")
            .HasMaxLength(50)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(x => x.IsPrimary)
            .HasColumnName("is_primary")
            .IsRequired()
            .HasDefaultValue(false)
            ;

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

        // Indexes
        builder.HasIndex(x => x.ContactId)
            .HasDatabaseName("ix_contact_address_contact");
    }
}
