using Crm.Domain.Entities.Contacts;
using Platform.Infrastructure.Data.Configurations.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Contacts;

public class ContactAddressConfiguration : AddressBaseConfiguration<ContactAddress>
{
    public override void Configure(EntityTypeBuilder<ContactAddress> builder)
    {
        base.Configure(builder);

        builder.ToTable("contact_address");

        builder.Property(x => x.ContactId)
            .HasColumnName("contact_id")
            .IsRequired();
    }
}
