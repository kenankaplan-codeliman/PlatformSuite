using Platform.Domain.Entities.Contacts;
using Platform.Infrastructure.Data.Configurations.Communications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Contacts;

public class ContactPhoneConfiguration : PhoneBaseConfiguration<ContactPhone>
{
    public override void Configure(EntityTypeBuilder<ContactPhone> builder)
    {
        base.Configure(builder);

        builder.ToTable("contact_phone");

        builder.Property(x => x.ContactId)
            .HasColumnName("contact_id")
            .IsRequired();
    }
}
