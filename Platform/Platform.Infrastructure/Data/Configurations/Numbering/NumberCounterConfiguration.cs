using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Platform.Domain.Entities.Numbering;

namespace Platform.Infrastructure.Data.Configurations.Numbering;

public class NumberCounterConfiguration : IEntityTypeConfiguration<NumberCounter>
{
    public void Configure(EntityTypeBuilder<NumberCounter> builder)
    {
        builder.ToTable("number_counter");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");
        builder.Property(c => c.DocumentType).HasColumnName("document_type").IsRequired().HasMaxLength(50);
        builder.Property(c => c.ResetPeriod).HasColumnName("reset_period").HasConversion<int>().IsRequired();
        builder.Property(c => c.PeriodKey).HasColumnName("period_key").IsRequired().HasMaxLength(20);
        builder.Property(c => c.LastValue).HasColumnName("last_value").IsRequired();
        builder.Property(c => c.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(c => c.UpdatedAt).HasColumnName("updated_at").IsRequired();

        // (document_type, period_key) unique constraint'i SQL script'inde tanımlı.
        builder.HasIndex(c => new { c.DocumentType, c.PeriodKey })
               .IsUnique()
               .HasDatabaseName("uq_number_counter_doctype_period");
    }
}
