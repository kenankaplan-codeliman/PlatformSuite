using CRM.Domain.Entities.Activities;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CRM.Infrastructure.Data.Configurations.Activities;

public class PhoneCallConfiguration : IEntityTypeConfiguration<PhoneCall>
{
    public void Configure(EntityTypeBuilder<PhoneCall> builder)
    {
        builder.ToTable("activity_phone_call");

        builder.Property(e => e.CallDirection)
            .HasColumnName("call_direction")
            .HasMaxLength(10)
            .IsRequired()
            .HasConversion<EnumToStringConverter<Direction>>();

        builder.Property(e => e.RecordingUrl)
            .HasColumnName("recording_url")
            .HasMaxLength(500);

        builder.Property(e => e.CallNotes)
            .HasColumnName("call_notes")
            .HasColumnType("text");

        // Ignored computed/wrapper properties
        builder.Ignore(e => e.Caller);
        builder.Ignore(e => e.Recipient);
    }
}
