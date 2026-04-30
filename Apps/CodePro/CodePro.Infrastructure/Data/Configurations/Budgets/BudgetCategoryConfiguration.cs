using CodePro.Domain.Entities.Budgets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Budgets;

public class BudgetCategoryConfiguration : IEntityTypeConfiguration<BudgetCategory>
{
    public void Configure(EntityTypeBuilder<BudgetCategory> builder)
    {
        builder.ToTable("budget_category");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50);
        builder.Property(e => e.Description).HasColumnName("description").HasMaxLength(1000);

        builder.Property(e => e.ParentCategoryId).HasColumnName("parent_category_id");

        builder.HasOne(e => e.ParentCategory)
            .WithMany(e => e.ChildCategories)
            .HasForeignKey(e => e.ParentCategoryId)
            .HasConstraintName("fk_budget_category_parent")
            .OnDelete(DeleteBehavior.Restrict);

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

        builder.HasIndex(e => e.Code).HasDatabaseName("ix_budget_category_code");
        builder.HasIndex(e => e.ParentCategoryId).HasDatabaseName("ix_budget_category_parent");
    }
}
