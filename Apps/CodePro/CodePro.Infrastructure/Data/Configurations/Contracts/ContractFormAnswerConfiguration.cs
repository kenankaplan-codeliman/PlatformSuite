using CodePro.Domain.Entities.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Contracts;

public class ContractFormAnswerConfiguration : IEntityTypeConfiguration<ContractFormAnswer>
{
    public void Configure(EntityTypeBuilder<ContractFormAnswer> builder)
    {
        builder.ToTable("contract_form_answer");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.ContractFormId).HasColumnName("contract_form_id").IsRequired();
        builder.Property(e => e.QuestionnaireQuestionId).HasColumnName("questionnaire_question_id").IsRequired();

        builder.Property(e => e.AnswerText).HasColumnName("answer_text").HasMaxLength(2000);
        builder.Property(e => e.AnswerNumber).HasColumnName("answer_number").HasColumnType("numeric(18,4)");
        builder.Property(e => e.AnswerDate).HasColumnName("answer_date");
        builder.Property(e => e.AnswerBool).HasColumnName("answer_bool");
        builder.Property(e => e.AnswerOptions).HasColumnName("answer_options").HasMaxLength(2000);

        builder.HasIndex(e => e.ContractFormId).HasDatabaseName("ix_contract_form_answer_form_id");
    }
}
