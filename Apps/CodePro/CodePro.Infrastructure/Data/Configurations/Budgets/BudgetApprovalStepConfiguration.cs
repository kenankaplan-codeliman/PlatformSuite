using CodePro.Domain.Entities.Budgets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Budgets;

public class BudgetApprovalStepConfiguration : IEntityTypeConfiguration<BudgetApprovalStep>
{
    public void Configure(EntityTypeBuilder<BudgetApprovalStep> builder)
    {
        builder.ToTable("budget_approval_step");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.BudgetId).HasColumnName("budget_id").IsRequired();
        builder.Property(e => e.OrderIndex).HasColumnName("order_index").IsRequired();
        builder.Property(e => e.ApproverUserId).HasColumnName("approver_user_id").IsRequired();
        builder.Property(e => e.RoleLabel).HasColumnName("role_label").HasMaxLength(200).IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.ActionedAt).HasColumnName("actioned_at");
        builder.Property(e => e.RejectionReason).HasColumnName("rejection_reason").HasMaxLength(2000);

        builder.HasIndex(e => e.BudgetId).HasDatabaseName("ix_budget_approval_step_budget");
    }
}
