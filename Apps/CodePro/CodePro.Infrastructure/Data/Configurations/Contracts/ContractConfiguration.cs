using CodePro.Domain.Entities.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Contracts;

public class ContractConfiguration : IEntityTypeConfiguration<Contract>
{
    public void Configure(EntityTypeBuilder<Contract> builder)
    {
        builder.ToTable("contract");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.ContractNumber).HasColumnName("contract_number").HasMaxLength(30).IsRequired();
        builder.Property(e => e.Subject).HasColumnName("subject").HasMaxLength(500).IsRequired();

        builder.Property(e => e.Type)
            .HasColumnName("type").HasMaxLength(50).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.CounterpartyName).HasColumnName("counterparty_name").HasMaxLength(300).IsRequired();
        builder.Property(e => e.CounterpartyId).HasColumnName("counterparty_id");
        builder.Property(e => e.RelatedOfferId).HasColumnName("related_offer_id");

        builder.Property(e => e.StartDate).HasColumnName("start_date").IsRequired();
        builder.Property(e => e.EndDate).HasColumnName("end_date");

        builder.Property(e => e.RenewalType)
            .HasColumnName("renewal_type").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.Amount).HasColumnName("amount").HasColumnType("numeric(18,2)");
        builder.Property(e => e.Currency)
            .HasColumnName("currency").HasMaxLength(10)
            .HasConversion<string?>();
        builder.Property(e => e.PaymentType)
            .HasColumnName("payment_type").HasMaxLength(30)
            .HasConversion<string?>();

        builder.Property(e => e.ResponsibleUserId).HasColumnName("responsible_user_id").IsRequired();
        builder.Property(e => e.AdditionalResponsibleUserIds).HasColumnName("additional_responsible_user_ids").HasColumnType("text");
        builder.Property(e => e.ReminderDaysBefore).HasColumnName("reminder_days_before").IsRequired().HasDefaultValue(30);

        builder.Property(e => e.Notes).HasColumnName("notes").HasColumnType("text");

        builder.Property(e => e.Status)
            .HasColumnName("status").HasMaxLength(50).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.SentToCounterpartyAt).HasColumnName("sent_to_counterparty_at");
        builder.Property(e => e.SignedAt).HasColumnName("signed_at");
        builder.Property(e => e.LastReminderSentAt).HasColumnName("last_reminder_sent_at");

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

        builder.HasIndex(e => e.ContractNumber).IsUnique().HasDatabaseName("uq_contract_number");

        builder.HasMany(e => e.ApprovalSteps)
            .WithOne()
            .HasForeignKey(s => s.ContractId)
            .HasConstraintName("fk_contract_approval_step_contract")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.Forms)
            .WithOne()
            .HasForeignKey(f => f.ContractId)
            .HasConstraintName("fk_contract_form_contract")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
