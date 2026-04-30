using CodePro.Domain.Entities.Offers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Offers;

public class OfferConfiguration : IEntityTypeConfiguration<Offer>
{
    public void Configure(EntityTypeBuilder<Offer> builder)
    {
        builder.ToTable("offer");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.OfferNumber).HasColumnName("offer_number").HasMaxLength(30).IsRequired();

        builder.Property(e => e.OfferType)
            .HasColumnName("offer_type").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(500).IsRequired();
        builder.Property(e => e.CounterpartyName).HasColumnName("counterparty_name").HasMaxLength(300).IsRequired();
        builder.Property(e => e.CounterpartyId).HasColumnName("counterparty_id");

        builder.Property(e => e.ResponsibleUserId).HasColumnName("responsible_user_id").IsRequired();
        builder.Property(e => e.ValidFrom).HasColumnName("valid_from");
        builder.Property(e => e.ValidUntil).HasColumnName("valid_until").IsRequired();

        builder.Property(e => e.Currency).HasColumnName("currency").HasMaxLength(10).IsRequired();
        builder.Property(e => e.DiscountPercentage).HasColumnName("discount_percentage").HasColumnType("numeric(5,2)").IsRequired();
        builder.Property(e => e.Subtotal).HasColumnName("subtotal").HasColumnType("numeric(18,2)").IsRequired();
        builder.Property(e => e.VatTotal).HasColumnName("vat_total").HasColumnType("numeric(18,2)").IsRequired();
        builder.Property(e => e.GrandTotal).HasColumnName("grand_total").HasColumnType("numeric(18,2)").IsRequired();

        builder.Property(e => e.Notes).HasColumnName("notes").HasColumnType("text");

        builder.Property(e => e.Status)
            .HasColumnName("status").HasMaxLength(50).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.ResultReason).HasColumnName("result_reason").HasColumnType("text");
        builder.Property(e => e.ResultReasonCategory).HasColumnName("result_reason_category").HasMaxLength(30);

        builder.Property(e => e.ConvertedContractId).HasColumnName("converted_contract_id");

        builder.Property(e => e.SentToCounterpartyAt).HasColumnName("sent_to_counterparty_at");
        builder.Property(e => e.ResultMarkedAt).HasColumnName("result_marked_at");

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

        builder.HasIndex(e => e.OfferNumber).IsUnique().HasDatabaseName("uq_offer_number");

        builder.HasMany(e => e.Items)
            .WithOne()
            .HasForeignKey(i => i.OfferId)
            .HasConstraintName("fk_offer_item_offer")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.ApprovalSteps)
            .WithOne()
            .HasForeignKey(s => s.OfferId)
            .HasConstraintName("fk_offer_approval_step_offer")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Forms)
            .WithOne()
            .HasForeignKey(f => f.OfferId)
            .HasConstraintName("fk_offer_form_offer")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Invitees)
            .WithOne()
            .HasForeignKey(i => i.OfferId)
            .HasConstraintName("fk_offer_invitee_offer")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
