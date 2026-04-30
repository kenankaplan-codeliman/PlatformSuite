using CodePro.Domain.Entities.Budgets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Budgets;

public class BudgetAllocationConfiguration : IEntityTypeConfiguration<BudgetAllocation>
{
    public void Configure(EntityTypeBuilder<BudgetAllocation> builder)
    {
        builder.ToTable("budget_allocation");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.BudgetId).HasColumnName("budget_id").IsRequired();

        builder.Property(e => e.SourceType)
            .HasColumnName("source_type").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.SourceId).HasColumnName("source_id").HasMaxLength(100).IsRequired();

        builder.Property(e => e.AllocatedAmount).HasColumnName("allocated_amount").HasColumnType("numeric(18,2)").IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(e => e.BudgetId).HasDatabaseName("ix_budget_allocation_budget");
        builder.HasIndex(e => new { e.SourceType, e.SourceId }).HasDatabaseName("ix_budget_allocation_source");
    }
}
