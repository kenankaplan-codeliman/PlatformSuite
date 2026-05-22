using Platform.Domain.Entities.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Activities;

public class AppointmentActivityConfiguration : IEntityTypeConfiguration<AppointmentActivity>
{
    public void Configure(EntityTypeBuilder<AppointmentActivity> builder)
    {
        builder.ToTable("activity_appointment");

        builder.Property(e => e.Location)
            .HasColumnName("location")
            .HasMaxLength(500);

        builder.Property(e => e.IsOnline)
            .HasColumnName("is_online")
            .IsRequired();

        builder.Property(e => e.MeetingUrl)
            .HasColumnName("meeting_url")
            .HasMaxLength(500);

        builder.Property(e => e.IsAllDay)
            .HasColumnName("is_all_day")
            .IsRequired();

        builder.Property(e => e.ReminderMinutesBefore)
            .HasColumnName("reminder_minutes_before");

        builder.Property(e => e.RecurrenceRule)
            .HasColumnName("recurrence_rule")
            .HasMaxLength(500);

        builder.Property(e => e.IsRecurring)
            .HasColumnName("is_recurring")
            .IsRequired();

        builder.Property(e => e.RecurringParentId)
            .HasColumnName("recurring_parent_id");

        builder.Property(e => e.MeetingNotes)
            .HasColumnName("meeting_notes")
            .HasColumnType("text");

        builder.Property(e => e.IsHtml)
            .HasColumnName("is_html")
            .IsRequired();

        // Ignored computed/wrapper properties
        builder.Ignore(e => e.Organizer);
        builder.Ignore(e => e.Attendees);
        builder.Ignore(e => e.RequiredAttendees);
        builder.Ignore(e => e.OptionalAttendees);
    }
}
