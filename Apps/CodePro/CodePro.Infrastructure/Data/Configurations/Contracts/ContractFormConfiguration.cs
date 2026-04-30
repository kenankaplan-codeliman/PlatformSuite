using CodePro.Domain.Entities.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Contracts;

public class ContractFormConfiguration : IEntityTypeConfiguration<ContractForm>
{
    public void Configure(EntityTypeBuilder<ContractForm> builder)
    {
        builder.ToTable("contract_form");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.ContractId).HasColumnName("contract_id").IsRequired();
        builder.Property(e => e.QuestionnaireId).HasColumnName("questionnaire_id").IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status").HasMaxLength(30).IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.FilledByUserId).HasColumnName("filled_by_user_id");
        builder.Property(e => e.FilledAt).HasColumnName("filled_at");
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();

        builder.HasIndex(e => e.ContractId).HasDatabaseName("ix_contract_form_contract_id");
        builder.HasIndex(e => e.QuestionnaireId).HasDatabaseName("ix_contract_form_questionnaire_id");

        builder.HasMany(e => e.Answers)
            .WithOne()
            .HasForeignKey(a => a.ContractFormId)
            .HasConstraintName("fk_contract_form_answer_form")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
