using CodePro.Domain.Entities.Questionnaires;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Questionnaires;

public class QuestionnaireQuestionConfiguration : IEntityTypeConfiguration<QuestionnaireQuestion>
{
    public void Configure(EntityTypeBuilder<QuestionnaireQuestion> builder)
    {
        builder.ToTable("questionnaire_question");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.QuestionnaireId).HasColumnName("questionnaire_id").IsRequired();

        builder.Property(e => e.QuestionText)
            .HasColumnName("question_text")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(e => e.QuestionType)
            .HasColumnName("question_type")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.IsRequired).HasColumnName("is_required").IsRequired().HasDefaultValue(false);
        builder.Property(e => e.OrderIndex).HasColumnName("order_index").IsRequired().HasDefaultValue(0);

        builder.HasIndex(e => e.QuestionnaireId).HasDatabaseName("ix_questionnaire_question_questionnaire_id");

        builder.HasMany(e => e.Options)
            .WithOne()
            .HasForeignKey(o => o.QuestionnaireQuestionId)
            .HasConstraintName("fk_questionnaire_question_option_question")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
