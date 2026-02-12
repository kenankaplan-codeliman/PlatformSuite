using CRM.Domain.Entities.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRM.Infrastructure.Data.Configurations.Activities;

public class TaskActivityConfiguration : IEntityTypeConfiguration<TaskActivity>
{
    public void Configure(EntityTypeBuilder<TaskActivity> builder)
    {
        builder.ToTable("activity_task");

        builder.Property(e => e.TaskDescription)
            .HasColumnName("task_description")
            .HasColumnType("text");

        builder.Property(e => e.ReminderAt)
            .HasColumnName("reminder_at");

        builder.Property(e => e.PercentComplete)
            .HasColumnName("percent_complete")
            .IsRequired();
    }
}
