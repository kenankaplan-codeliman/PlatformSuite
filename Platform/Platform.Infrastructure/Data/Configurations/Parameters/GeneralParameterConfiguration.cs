using Platform.Domain.Entities.Parameters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Platform.Infrastructure.Data.Configurations.Parameters;

public class GeneralParameterConfiguration : IEntityTypeConfiguration<GeneralParameter>
{
    public void Configure(EntityTypeBuilder<GeneralParameter> builder)
    {
        builder.ToTable("general_parameter");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.Code).HasColumnName("code").IsRequired().HasMaxLength(100);
        builder.Property(p => p.ParentCode).HasColumnName("parent_code").HasMaxLength(100);
        builder.Property(p => p.Label).HasColumnName("label").IsRequired().HasMaxLength(250);
        builder.Property(p => p.OrderIndex).HasColumnName("order_index").IsRequired().HasDefaultValue(0);
        builder.Property(p => p.Description).HasColumnName("description").HasMaxLength(500);
        builder.Property(p => p.IsActive).HasColumnName("is_active").IsRequired().HasDefaultValue(true);
        builder.Property(p => p.CreatedBy).HasColumnName("created_by").IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");

        // Asıl unique kısıtlar SQL script'inde partial index olarak tanımlıdır
        // (kök satır code, değer satırı parent_code+code). Buradaki index
        // yalnız gruplu listeleme sorgusu içindir.
        builder.HasIndex(p => p.ParentCode).HasDatabaseName("idx_general_parameter_parent_code");
    }
}
