using CodePro.Domain.Entities.Budgets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Budgets;

public class BudgetTransactionConfiguration : IEntityTypeConfiguration<BudgetTransaction>
{
    public void Configure(EntityTypeBuilder<BudgetTransaction> builder)
    {
        builder.ToTable("budget_transaction");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.BudgetId).HasColumnName("budget_id").IsRequired();

        builder.Property(e => e.TransactionType)
            .HasColumnName("transaction_type").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.Amount).HasColumnName("amount").HasColumnType("numeric(18,2)").IsRequired();

        builder.Property(e => e.SourceType)
            .HasColumnName("source_type").HasMaxLength(30)
            .HasConversion<string>();

        builder.Property(e => e.SourceId).HasColumnName("source_id").HasMaxLength(100);
        builder.Property(e => e.Description).HasColumnName("description").HasColumnType("text");

        builder.Property(e => e.PerformedBy).HasColumnName("performed_by").IsRequired();
        builder.Property(e => e.PerformedAt).HasColumnName("performed_at").IsRequired();

        builder.Property(e => e.RelatedTransactionId).HasColumnName("related_transaction_id");

        builder.HasIndex(e => e.BudgetId).HasDatabaseName("ix_budget_transaction_budget");
        builder.HasIndex(e => new { e.SourceType, e.SourceId }).HasDatabaseName("ix_budget_transaction_source");
    }
}
