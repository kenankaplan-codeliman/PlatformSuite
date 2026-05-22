using Platform.Domain.Entities.Activities;
using Platform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Platform.Infrastructure.Data.Configurations.Activities;

public class PhoneCallActivityConfiguration : IEntityTypeConfiguration<PhoneCallActivity>
{
    public void Configure(EntityTypeBuilder<PhoneCallActivity> builder)
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

        builder.Property(e => e.IsHtml)
            .HasColumnName("is_html")
            .IsRequired();

        // Ignored computed/wrapper properties
        builder.Ignore(e => e.Caller);
        builder.Ignore(e => e.Recipient);
    }
}
