using Crm.Domain.Entities.Contacts;
using Platform.Infrastructure.Data.Configurations.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Contacts;

public class ContactEmailConfiguration : EmailBaseConfiguration<ContactEmail>
{
    public override void Configure(EntityTypeBuilder<ContactEmail> builder)
    {
        base.Configure(builder);

        builder.ToTable("contact_email");

        builder.Property(x => x.ContactId)
            .HasColumnName("contact_id")
            .IsRequired();
    }
}
