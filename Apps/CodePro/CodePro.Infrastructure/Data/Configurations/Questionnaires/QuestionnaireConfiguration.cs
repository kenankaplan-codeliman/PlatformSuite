using CodePro.Domain.Entities.Questionnaires;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CodePro.Infrastructure.Data.Configurations.Questionnaires;

public class QuestionnaireConfiguration : IEntityTypeConfiguration<Questionnaire>
{
    public void Configure(EntityTypeBuilder<Questionnaire> builder)
    {
        builder.ToTable("questionnaire");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(e => e.RelatedModule)
            .HasColumnName("related_module")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

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

        builder.HasMany(e => e.Questions)
            .WithOne()
            .HasForeignKey(q => q.QuestionnaireId)
            .HasConstraintName("fk_questionnaire_question_questionnaire")
            .OnDelete(DeleteBehavior.Cascade);
    }
}
