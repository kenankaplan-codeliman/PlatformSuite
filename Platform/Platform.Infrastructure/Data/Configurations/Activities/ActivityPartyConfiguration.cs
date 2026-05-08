using Platform.Domain.Entities.Activities;
using Platform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Platform.Infrastructure.Data.Configurations.Activities;

public class ActivityPartyConfiguration : IEntityTypeConfiguration<ActivityParty>
{
    public void Configure(EntityTypeBuilder<ActivityParty> builder)
    {
        builder.ToTable("activity_party");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.ActivityId)
            .HasColumnName("activity_id")
            .IsRequired();

        builder.Property(e => e.PartyType)
            .HasColumnName("party_type")
            .HasMaxLength(20)
            .IsRequired()
            .HasConversion<EnumToStringConverter<ActivityPartyType>>();

        builder.Property(e => e.ParticipantEntityType)
            .HasColumnName("participant_entity_type")
            .HasMaxLength(50);

        builder.Property(e => e.ParticipantEntityId)
            .HasColumnName("participant_entity_id");

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(200);

        builder.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(255);

        builder.Property(e => e.PhoneNumber)
            .HasColumnName("phone_number")
            .HasMaxLength(50);

        builder.Property(e => e.SortOrder)
            .HasColumnName("sort_order")
            .IsRequired();

        builder.Property(e => e.ResponseStatus)
            .HasColumnName("response_status")
            .HasMaxLength(50);

        builder.Property(e => e.RespondedAt)
            .HasColumnName("responded_at");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired();

        // Ignored computed properties
        builder.Ignore(e => e.DisplayName);
        builder.Ignore(e => e.IsExternal);
    }
}
