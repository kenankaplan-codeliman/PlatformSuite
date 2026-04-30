using CodePro.Domain.Entities.Questionnaires;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Questionnaires;

public class QuestionnaireQuestionOptionConfiguration : IEntityTypeConfiguration<QuestionnaireQuestionOption>
{
    public void Configure(EntityTypeBuilder<QuestionnaireQuestionOption> builder)
    {
        builder.ToTable("questionnaire_question_option");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.QuestionnaireQuestionId).HasColumnName("questionnaire_question_id").IsRequired();

        builder.Property(e => e.OptionText)
            .HasColumnName("option_text")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(e => e.OrderIndex).HasColumnName("order_index").IsRequired().HasDefaultValue(0);

        builder.HasIndex(e => e.QuestionnaireQuestionId).HasDatabaseName("ix_questionnaire_question_option_question_id");
    }
}
