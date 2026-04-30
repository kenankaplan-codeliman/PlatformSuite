using Platform.Domain.Entities.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Activities;

public class EmailActivityConfiguration : IEntityTypeConfiguration<EmailActivity>
{
    public void Configure(EntityTypeBuilder<EmailActivity> builder)
    {
        builder.ToTable("activity_email");

        builder.Property(e => e.Body)
            .HasColumnName("body")
            .HasColumnType("text");

        builder.Property(e => e.IsHtml)
            .HasColumnName("is_html")
            .IsRequired();

        builder.Property(e => e.IsSent)
            .HasColumnName("is_sent")
            .IsRequired();

        builder.Property(e => e.IsRead)
            .HasColumnName("is_read")
            .IsRequired();

        builder.Property(e => e.ReadDate)
            .HasColumnName("read_date");

        // Ignored computed/wrapper properties
        builder.Ignore(e => e.From);
        builder.Ignore(e => e.ToRecipients);
        builder.Ignore(e => e.CcRecipients);
        builder.Ignore(e => e.BccRecipients);
    }
}
