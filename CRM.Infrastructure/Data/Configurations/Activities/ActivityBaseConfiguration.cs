using CRM.Domain.Entities.Activities;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CRM.Infrastructure.Data.Configurations.Activities;

public class ActivityBaseConfiguration : IEntityTypeConfiguration<ActivityBase>
{
    public void Configure(EntityTypeBuilder<ActivityBase> builder)
    {
        builder.ToTable("activity");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        
        builder.UseTptMappingStrategy();

        builder.Property(e => e.Subject)
            .HasColumnName("subject")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.ActivityType)
            .HasColumnName("activity_type")
            .HasMaxLength(20)
            .IsRequired()
            .HasConversion<EnumToStringConverter<ActivityType>>();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .IsRequired()
            .HasConversion<EnumToStringConverter<ActivityStatus>>();

        builder.Property(e => e.Priority)
            .HasColumnName("priority")
            .HasMaxLength(10)
            .IsRequired()
            .HasConversion<EnumToStringConverter<ActivityPriority>>();

        builder.Property(e => e.StartDate)
            .HasColumnName("start_date");

        builder.Property(e => e.DueDate)
            .HasColumnName("due_date");

        builder.Property(e => e.EndDate)
            .HasColumnName("end_date");

        builder.Property(e => e.RegardingEntityType)
            .HasColumnName("regarding_entity_type")
            .HasMaxLength(50)
            .HasConversion<EnumToStringConverter<EntityType>>();

        builder.Property(e => e.RegardingEntityId)
            .HasColumnName("regarding_entity_id");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired();

        // Multi Tenant
        builder.Property(e => e.OwnerId)
            .HasColumnName("owner_id")
            .IsRequired();

        builder.Property(e => e.OrganizationId)
            .HasColumnName("organization_id")
            .IsRequired();

        // Audit
        builder.Property(e => e.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(e => e.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at");

        // Soft Delete
        builder.Property(e => e.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired();

        builder.Property(e => e.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(e => e.DeletedAt)
            .HasColumnName("deleted_at");

        // Relationship: ActivityBase -> ActivityParty (tek yönlü)
        builder.HasMany(a => a.Parties)
            .WithOne()
            .HasForeignKey(p => p.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(a => a.Parties).AutoInclude();

        // Ignored computed properties
        builder.Ignore(e => e.Duration);

    }
}
