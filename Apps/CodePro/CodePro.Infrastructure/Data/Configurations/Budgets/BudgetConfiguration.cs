using CodePro.Domain.Entities.Budgets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Budgets;

public class BudgetConfiguration : IEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        builder.ToTable("budget");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(300).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description").HasMaxLength(1000);

        builder.Property(e => e.ScopeOrganizationId).HasColumnName("scope_organization_id");
        builder.Property(e => e.BudgetCategoryId).HasColumnName("budget_category_id");

        builder.HasOne(e => e.ScopeOrganization)
            .WithMany()
            .HasForeignKey(e => e.ScopeOrganizationId)
            .HasConstraintName("fk_budget_scope_organization")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.BudgetCategory)
            .WithMany()
            .HasForeignKey(e => e.BudgetCategoryId)
            .HasConstraintName("fk_budget_category")
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.PeriodType)
            .HasColumnName("period_type").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.StartDate).HasColumnName("start_date").IsRequired();
        builder.Property(e => e.EndDate).HasColumnName("end_date").IsRequired();

        builder.Property(e => e.TotalAmount).HasColumnName("total_amount").HasColumnType("numeric(18,2)").IsRequired();
        builder.Property(e => e.Currency).HasColumnName("currency").HasMaxLength(10).IsRequired();

        builder.Property(e => e.OverflowBehavior)
            .HasColumnName("overflow_behavior").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.ReservationReleasePoint)
            .HasColumnName("reservation_release_point").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.AlertThresholdPercentage).HasColumnName("alert_threshold_percentage").IsRequired();
        builder.Property(e => e.CarryOverEnabled).HasColumnName("carry_over_enabled").IsRequired();

        builder.Property(e => e.ResponsibleUserId).HasColumnName("responsible_user_id").IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
        builder.Property(e => e.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(e => e.OrganizationId).HasColumnName("organization_id").IsRequired();

        builder.Property(e => e.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(e => e.UpdatedBy).HasColumnName("updated_by");
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at");

        builder.Property(e => e.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(e => e.DeletedBy).HasColumnName("deleted_by");
        builder.Property(e => e.DeletedAt).HasColumnName("deleted_at");

        builder.HasMany(e => e.Transactions)
            .WithOne(t => t.Budget)
            .HasForeignKey(t => t.BudgetId)
            .HasConstraintName("fk_budget_transaction_budget")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Allocations)
            .WithOne(a => a.Budget)
            .HasForeignKey(a => a.BudgetId)
            .HasConstraintName("fk_budget_allocation_budget")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.ApprovalSteps)
            .WithOne(s => s.Budget)
            .HasForeignKey(s => s.BudgetId)
            .HasConstraintName("fk_budget_approval_step_budget")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => new { e.ScopeOrganizationId, e.BudgetCategoryId, e.StartDate, e.EndDate })
            .HasDatabaseName("ix_budget_scope_category_period");

        builder.HasIndex(e => e.Status).HasDatabaseName("ix_budget_status");
        builder.HasIndex(e => e.EndDate).HasDatabaseName("ix_budget_end_date");
    }
}
