using CRM.Domain.Entities.Opportunities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRM.Infrastructure.Data.Configurations.Opportunities;

public class OpportunityProductConfiguration : IEntityTypeConfiguration<OpportunityProduct>
{
    public void Configure(EntityTypeBuilder<OpportunityProduct> builder)
    {
        builder.ToTable("opportunity_product");

        // Primary Key
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        // FK alanlar
        builder.Property(x => x.OpportunityId)
            .HasColumnName("opportunity_id")
            .IsRequired();

        builder.Property(x => x.ProductId)
            .HasColumnName("product_id")
            .IsRequired();

        // IBaseEntity
        builder.Property(x => x.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        // IAuditableEntity
        builder.Property(x => x.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.UpdatedBy)
            .HasColumnName("updated_by");

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at");

        // ISoftDeleteEntity
        builder.Property(x => x.IsDeleted)
            .HasColumnName("is_deleted")
            .IsRequired()
            .HasDefaultValue(false);

        builder.Property(x => x.DeletedBy)
            .HasColumnName("deleted_by");

        builder.Property(x => x.DeletedAt)
            .HasColumnName("deleted_at");

        // Relationships — FK'lar üst tablolarda tanımlıdır; burada sadece navigation açıklanır
        builder.HasOne(x => x.Opportunity)
            .WithMany(x => x.OpportunityProducts)
            .HasForeignKey(x => x.OpportunityId)
            .HasConstraintName("fk_opportunity_product_opportunity")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Product)
            .WithMany(x => x.OpportunityProducts)
            .HasForeignKey(x => x.ProductId)
            .HasConstraintName("fk_opportunity_product_product")
            .OnDelete(DeleteBehavior.Restrict);
    }
}