using CodePro.Domain.Entities.Offers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Offers;

public class OfferFormAnswerConfiguration : IEntityTypeConfiguration<OfferFormAnswer>
{
    public void Configure(EntityTypeBuilder<OfferFormAnswer> builder)
    {
        builder.ToTable("offer_form_answer");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.OfferFormId).HasColumnName("offer_form_id").IsRequired();
        builder.Property(e => e.QuestionnaireQuestionId).HasColumnName("questionnaire_question_id").IsRequired();

        builder.Property(e => e.AnswerText).HasColumnName("answer_text").HasMaxLength(2000);
        builder.Property(e => e.AnswerNumber).HasColumnName("answer_number").HasColumnType("numeric(18,4)");
        builder.Property(e => e.AnswerDate).HasColumnName("answer_date");
        builder.Property(e => e.AnswerBool).HasColumnName("answer_bool");
        builder.Property(e => e.AnswerOptions).HasColumnName("answer_options").HasMaxLength(2000);

        builder.HasIndex(e => e.OfferFormId).HasDatabaseName("ix_offer_form_answer_form_id");
    }
}
