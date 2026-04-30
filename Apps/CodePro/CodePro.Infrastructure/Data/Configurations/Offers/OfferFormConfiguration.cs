using CodePro.Domain.Entities.Offers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Offers;

public class OfferFormConfiguration : IEntityTypeConfiguration<OfferForm>
{
    public void Configure(EntityTypeBuilder<OfferForm> builder)
    {
        builder.ToTable("offer_form");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.OfferId).HasColumnName("offer_id").IsRequired();
        builder.Property(e => e.QuestionnaireId).HasColumnName("questionnaire_id").IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.FilledByUserId).HasColumnName("filled_by_user_id");
        builder.Property(e => e.FilledAt).HasColumnName("filled_at");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();

        builder.HasIndex(e => e.OfferId).HasDatabaseName("ix_offer_form_offer_id");

        builder.HasMany(e => e.Answers)
            .WithOne()
            .HasForeignKey(a => a.OfferFormId)
            .HasConstraintName("fk_offer_form_answer_form")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
