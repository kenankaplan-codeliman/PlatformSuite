using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Platform.Infrastructure.Data.Configurations.Identities;

public class AppRolePrivilegeConfiguration : IEntityTypeConfiguration<AppRolePrivilege>
{
    public void Configure(EntityTypeBuilder<AppRolePrivilege> builder)
    {
        builder.ToTable("app_role_privilege");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.RoleId)
            .HasColumnName("role_id")
            .IsRequired();

        builder.Property(e => e.PrivilegeCode)
            .HasColumnName("privilege_code")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.AccessLevel)
            .HasColumnName("access_level")
            .HasMaxLength(20)
            .IsRequired()
            .HasConversion<EnumToStringConverter<AccessLevel>>();

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired();

        // Relationship
        builder.HasOne<AppRole>()
            .WithMany()
            .HasForeignKey(e => e.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
