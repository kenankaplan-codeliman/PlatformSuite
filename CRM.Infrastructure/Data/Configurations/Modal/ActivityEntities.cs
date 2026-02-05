using CRM.Domain.Entities.Activity;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CRM.Infrastructure.Data.Configurations.Modal;

public static class ActivityEntities
{
    public static void ConfigureActivityEntities(this ModelBuilder modelBuilder)
    {
        // =====================================================
        // activity (BASE)
        // =====================================================
        modelBuilder.Entity<ActivityBase>(entity =>
        {
            entity.ToTable("activity");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.Subject)
                .HasColumnName("subject")
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.ActivityType)
                .HasColumnName("activity_type")
                .HasMaxLength(20)
                .IsRequired()
                .HasConversion<EnumToStringConverter<ActivityType>>();

            entity.Property(e => e.Status)
                .HasColumnName("status")
                .HasMaxLength(20)
                .IsRequired()
                .HasConversion<EnumToStringConverter<ActivityStatus>>();

            entity.Property(e => e.Priority)
                .HasColumnName("priority")
                .HasMaxLength(10)
                .IsRequired()
                .HasConversion<EnumToStringConverter<ActivityPriority>>();

            entity.Property(e => e.StartDate)
                .HasColumnName("start_date");

            entity.Property(e => e.DueDate)
                .HasColumnName("due_date");

            entity.Property(e => e.CompletedDate)
                .HasColumnName("completed_date");

            entity.Property(e => e.Duration)
                .HasColumnName("duration");

            entity.Property(e => e.RegardingEntityType)
                .HasColumnName("regarding_entity_type")
                .HasMaxLength(50);

            entity.Property(e => e.RegardingEntityId)
                .HasColumnName("regarding_entity_id");

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(e => e.IsDeleted)
                .HasColumnName("is_deleted")
                .IsRequired();

            entity.Property(e => e.DeletedBy)
                .HasColumnName("deleted_by");

            entity.Property(e => e.DeletedAt)
                .HasColumnName("deleted_at");

            entity.Property(e => e.OwnerId)
                .HasColumnName("owner_id")
                .IsRequired();

            entity.Property(e => e.OrganizationId)
                .HasColumnName("organization_id")
                .IsRequired();
        });

        // =====================================================
        // activity_party
        // =====================================================
        modelBuilder.Entity<ActivityParty>(entity =>
        {
            entity.ToTable("activity_party");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.ActivityId)
                .HasColumnName("activity_id")
                .IsRequired();

            entity.Property(e => e.PartyType)
                .HasColumnName("party_type")
                .HasMaxLength(20)
                .IsRequired()
                .HasConversion<EnumToStringConverter<ActivityPartyType>>();

            entity.Property(e => e.ParticipantType)
                .HasColumnName("participant_type")
                .HasMaxLength(20)
                .IsRequired()
                .HasConversion<EnumToStringConverter<ActivityParticipantType>>();

            entity.Property(e => e.ParticipantId)
                .HasColumnName("participant_id");

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(200);

            entity.Property(e => e.Email)
                .HasColumnName("email")
                .HasMaxLength(255);

            entity.Property(e => e.PhoneNumber)
                .HasColumnName("phone_number")
                .HasMaxLength(50);

            entity.Property(e => e.SortOrder)
                .HasColumnName("sort_order")
                .IsRequired();

            entity.Property(e => e.ResponseStatus)
                .HasColumnName("response_status")
                .HasMaxLength(50);

            entity.Property(e => e.RespondedAt)
                .HasColumnName("responded_at");

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.HasOne(p => p.Activity)
                .WithMany(a => a.Parties)
                .HasForeignKey(p => p.ActivityId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =====================================================
        // activity_email
        // =====================================================
        modelBuilder.Entity<EmailActivity>(entity =>
        {
            entity.ToTable("activity_email");

            entity.Property(e => e.EmailSubject)
                .HasColumnName("email_subject")
                .HasMaxLength(500);

            entity.Property(e => e.Body)
                .HasColumnName("body")
                .HasColumnType("text");

            entity.Property(e => e.IsHtml)
                .HasColumnName("is_html")
                .IsRequired();

            entity.Property(e => e.IsSent)
                .HasColumnName("is_sent")
                .IsRequired();

            entity.Property(e => e.IsRead)
                .HasColumnName("is_read")
                .IsRequired();

            entity.Property(e => e.ReadDate)
                .HasColumnName("read_date");
        });

        // =====================================================
        // activity_phone_call
        // =====================================================
        modelBuilder.Entity<PhoneCallActivity>(entity =>
        {
            entity.ToTable("activity_phone_call");

            entity.Property(e => e.CallDirection)
                .HasColumnName("call_direction")
                .HasMaxLength(10)
                .IsRequired()
                .HasConversion<EnumToStringConverter<CallDirection>>();

            entity.Property(e => e.PhoneNumber)
                .HasColumnName("phone_number")
                .HasMaxLength(50);

            entity.Property(e => e.RecordingUrl)
                .HasColumnName("recording_url")
                .HasMaxLength(500);

            entity.Property(e => e.CallNotes)
                .HasColumnName("call_notes")
                .HasColumnType("text");

            entity.Property(e => e.CallResult)
                .HasColumnName("call_result")
                .HasMaxLength(100);
        });

        // =====================================================
        // activity_task
        // =====================================================
        modelBuilder.Entity<TaskActivity>(entity =>
        {
            entity.ToTable("activity_task");

            entity.Property(e => e.TaskDescription)
                .HasColumnName("task_description")
                .HasColumnType("text");

            entity.Property(e => e.IsCompleted)
                .HasColumnName("is_completed")
                .IsRequired();

            entity.Property(e => e.ReminderAt)
                .HasColumnName("reminder_at");

            entity.Property(e => e.IsReminderSet)
                .HasColumnName("is_reminder_set")
                .IsRequired();

            entity.Property(e => e.IsReminderSent)
                .HasColumnName("is_reminder_sent")
                .IsRequired();

            entity.Property(e => e.PercentComplete)
                .HasColumnName("percent_complete")
                .IsRequired();

            entity.Property(e => e.StartDate)
                .HasColumnName("start_date");
        });

        // =====================================================
        // activity_appointment
        // =====================================================
        modelBuilder.Entity<AppointmentActivity>(entity =>
        {
            entity.ToTable("activity_appointment");

            entity.Property(e => e.Location)
                .HasColumnName("location")
                .HasMaxLength(500);

            entity.Property(e => e.IsOnline)
                .HasColumnName("is_online")
                .IsRequired();

            entity.Property(e => e.MeetingUrl)
                .HasColumnName("meeting_url")
                .HasMaxLength(500);

            entity.Property(e => e.IsAllDay)
                .HasColumnName("is_all_day")
                .IsRequired();

            entity.Property(e => e.ReminderMinutesBefore)
                .HasColumnName("reminder_minutes_before");

            entity.Property(e => e.RecurrenceRule)
                .HasColumnName("recurrence_rule")
                .HasMaxLength(500);

            entity.Property(e => e.IsRecurring)
                .HasColumnName("is_recurring")
                .IsRequired();

            entity.Property(e => e.RecurringParentId)
                .HasColumnName("recurring_parent_id");

            entity.Property(e => e.MeetingNotes)
                .HasColumnName("meeting_notes")
                .HasColumnType("text");
        });
    }
}
