using CRM.Domain.Entities.Identities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRM.Infrastructure.Data.Configurations.Identities;

public class AppLoginConfiguration : IEntityTypeConfiguration<AppLogin>
{
    public void Configure(EntityTypeBuilder<AppLogin> builder)
    {
        builder.ToTable("app_user_login");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(e => e.LoginDate)
            .HasColumnName("login_date")
            .IsRequired();

        builder.Property(e => e.LogoutDate)
            .HasColumnName("logout_date");

        builder.Property(e => e.AccessTokenId)
            .HasColumnName("access_token_id")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.AccessTokenExpiresAt)
            .HasColumnName("access_token_expires_at")
            .IsRequired();

        builder.Property(e => e.RefreshTokenId)
            .HasColumnName("refresh_token_id")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.RefreshTokenExpiresAt)
            .HasColumnName("refresh_token_expires_at")
            .IsRequired();

        builder.Property(e => e.RefreshCount)
            .HasColumnName("refresh_count")
            .IsRequired();

        builder.Property(e => e.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(50);

        builder.Property(e => e.UserAgent)
            .HasColumnName("user_agent")
            .HasMaxLength(1000);

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active")
            .IsRequired();

        // Relationship
        builder.HasOne<AppUser>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
