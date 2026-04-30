using CodePro.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Accounts;

public class AccountProductCategoryConfiguration : IEntityTypeConfiguration<AccountProductCategory>
{
    public void Configure(EntityTypeBuilder<AccountProductCategory> builder)
    {
        builder.ToTable("account_product_category");
        builder.HasKey(apc => apc.Id);
        builder.Property(apc => apc.Id).HasColumnName("id");
        builder.Property(apc => apc.AccountId).HasColumnName("account_id").IsRequired();
        builder.Property(apc => apc.ProductCategoryId).HasColumnName("product_category_id").IsRequired();
        builder.Property(apc => apc.IsPreferred).HasColumnName("is_preferred").HasDefaultValue(false);
        builder.Property(apc => apc.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(apc => apc.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(apc => apc.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(apc => apc.UpdatedBy).HasColumnName("updated_by");
        builder.Property(apc => apc.UpdatedAt).HasColumnName("updated_at");
        builder.Property(apc => apc.IsDeleted).HasColumnName("is_deleted").HasDefaultValue(false);
        builder.Property(apc => apc.DeletedBy).HasColumnName("deleted_by");
        builder.Property(apc => apc.DeletedAt).HasColumnName("deleted_at");

        builder.HasOne(apc => apc.Account)
            .WithMany()
            .HasForeignKey(apc => apc.AccountId)
            .HasConstraintName("fk_account_product_category_account")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(apc => apc.ProductCategory)
            .WithMany()
            .HasForeignKey(apc => apc.ProductCategoryId)
            .HasConstraintName("fk_account_product_category_category")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(apc => apc.AccountId)
            .HasDatabaseName("idx_account_product_category_account");

        builder.HasIndex(apc => apc.ProductCategoryId)
            .HasDatabaseName("idx_account_product_category_category");

        builder.HasIndex(apc => new { apc.AccountId, apc.ProductCategoryId })
            .IsUnique()
            .HasFilter("is_deleted = FALSE")
            .HasDatabaseName("uq_account_product_category");
    }
}
