using Crm.Domain.Entities.Opportunities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Crm.Infrastructure.Data.Configurations.Opportunities;

public class OpportunityConfiguration : IEntityTypeConfiguration<Opportunity>
{
    public void Configure(EntityTypeBuilder<Opportunity> builder)
    {
        builder.ToTable("opportunity");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Id).HasColumnName("id");

        builder.Property(o => o.IsActive)
            .HasColumnName("is_active")
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(o => o.Name)
            .HasColumnName("name")
            .IsRequired()
            .HasMaxLength(250);

        // Fırsat Kodu — numarator ile üretilir; benzersiz (DB tarafında lower() partial
        // unique index, V008 schema script'inde tanımlı).
        builder.Property(o => o.OpportunityCode)
            .HasColumnName("opportunity_code")
            .IsRequired()
            .HasMaxLength(30);

        builder.Property(o => o.Description).HasColumnName("description").HasColumnType("text");

        builder.Property(o => o.AccountId).HasColumnName("account_id").IsRequired();
        builder.Property(o => o.PrimaryContactId).HasColumnName("primary_contact_id");

        builder.HasOne(o => o.Account)
            .WithMany()
            .HasForeignKey(o => o.AccountId)
            .HasConstraintName("fk_opportunity_account")
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.PrimaryContact)
            .WithMany()
            .HasForeignKey(o => o.PrimaryContactId)
            .HasConstraintName("fk_opportunity_primary_contact")
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        builder.Property(o => o.Stage)
            .HasColumnName("stage")
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(o => o.EstimatedAmount).HasColumnName("estimated_amount").HasPrecision(18, 2);
        // Deal-level para birimi: GeneralParameter code (CurrencyType) — düz string.
        // EstimatedAmount + ActualAmount + tüm OpportunityProduct satırları bu currency'dedir.
        builder.Property(o => o.Currency).HasColumnName("currency").HasMaxLength(10);
        // ActualAmount sunucu tarafında Products toplamı olarak hesaplanır (tek currency olduğu için doğru).
        builder.Property(o => o.ActualAmount).HasColumnName("actual_amount").HasPrecision(18, 2);

        // Net + indirim toplamları handler/mapping tarafından satırlardan hesaplanır;
        // client değeri yok sayılır. Currency parent Opportunity.Currency'sidir.
        builder.Property(o => o.ActualNetAmount).HasColumnName("actual_net_amount").HasPrecision(18, 2);
        // TotalDiscountAmount = Σ satır DiscountAmount (tutar). TotalDiscountRate = Σ satır
        // DiscountRate (yüzde) — satır sayısıyla 100'ü aşabilir, bu yüzden geniş precision.
        // TotalDiscount = ikisinin birlikte para birimi karşılığı (ActualAmount − ActualNetAmount).
        builder.Property(o => o.TotalDiscountAmount).HasColumnName("total_discount_amount").HasPrecision(18, 2);
        builder.Property(o => o.TotalDiscountRate).HasColumnName("total_discount_rate").HasPrecision(9, 2);
        builder.Property(o => o.TotalDiscount).HasColumnName("total_discount").HasPrecision(18, 2);

        builder.Property(o => o.Probability)
            .HasColumnName("probability")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(o => o.CloseDate).HasColumnName("close_date");
        builder.Property(o => o.LossReason).HasColumnName("loss_reason").HasMaxLength(500);

        // Owner
        builder.Property(o => o.OwnerId).HasColumnName("owner_id").IsRequired();
        builder.Property(o => o.OrganizationId).HasColumnName("organization_id").IsRequired();

        // Audit
        builder.Property(o => o.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(o => o.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(o => o.UpdatedBy).HasColumnName("updated_by");
        builder.Property(o => o.UpdatedAt).HasColumnName("updated_at");

        // Soft Delete
        builder.Property(o => o.IsDeleted).HasColumnName("is_deleted").IsRequired().HasDefaultValue(false);
        builder.Property(o => o.DeletedBy).HasColumnName("deleted_by");
        builder.Property(o => o.DeletedAt).HasColumnName("deleted_at");

        builder.HasMany(o => o.Products)
            .WithOne(p => p.Opportunity)
            .HasForeignKey(p => p.OpportunityId)
            .HasConstraintName("fk_opportunity_product_opportunity")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(o => o.Stage).HasDatabaseName("ix_opportunity_stage");
        builder.HasIndex(o => o.AccountId).HasDatabaseName("ix_opportunity_account");
        builder.HasIndex(o => o.OpportunityCode).IsUnique().HasDatabaseName("ux_opportunity_code");
    }
}
