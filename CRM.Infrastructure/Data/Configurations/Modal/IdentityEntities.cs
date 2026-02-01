using CRM.Domain.Entities.Identity;
using CRM.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CRM.Infrastructure.Data.Configurations.Modal;

public static class IdentityEntities
{
    public static void ConfigureIdentityEntities(this ModelBuilder modelBuilder)
    {
        // =====================================================
        // app_organization
        // =====================================================
        modelBuilder.Entity<AppOrganization>(entity =>
        {
            entity.ToTable("app_organization");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.OrganizationCode)
                .HasColumnName("organization_code")
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.OrganizationName)
                .HasColumnName("organization_name")
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(e => e.Description)
                .HasColumnName("description")
                .HasMaxLength(1000)
                .IsRequired();

            entity.Property(e => e.ParentOrganizationId)
                .HasColumnName("parent_organization_id");

            entity.Property(e => e.IsDefault)
                .HasColumnName("is_default")
                .IsRequired();

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            // Auditable
            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            // Soft delete
            entity.Property(e => e.IsDeleted)
                .HasColumnName("is_deleted")
                .IsRequired();

            entity.Property(e => e.DeletedBy)
                .HasColumnName("deleted_by");

            entity.Property(e => e.DeletedAt)
                .HasColumnName("deleted_at");

            entity.HasOne<AppOrganization>()
                .WithMany()
                .HasForeignKey(e => e.ParentOrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // =====================================================
        // app_user
        // =====================================================
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("app_user");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.Email)
                .HasColumnName("email")
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(e => e.FirstName)
                .HasColumnName("first_name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.LastName)
                .HasColumnName("last_name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.Microsoft365Id)
                .HasColumnName("microsoft365_id")
                .HasMaxLength(100);

            entity.Property(e => e.PasswordHash)
                .HasColumnName("password_hash")
                .HasMaxLength(500);

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            // Auditable
            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");

            // Soft delete
            entity.Property(e => e.IsDeleted)
                .HasColumnName("is_deleted")
                .IsRequired();

            entity.Property(e => e.DeletedBy)
                .HasColumnName("deleted_by");

            entity.Property(e => e.DeletedAt)
                .HasColumnName("deleted_at");


            entity.Property(e => e.OrganizationId)
                .HasColumnName("organization_id")
                .IsRequired();

            entity.HasOne<AppOrganization>()
                .WithMany()
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // =====================================================
        // app_role
        // =====================================================
        modelBuilder.Entity<AppRole>(entity =>
        {
            entity.ToTable("app_role");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.RoleName)
                .HasColumnName("role_name")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.Description)
                .HasColumnName("description")
                .HasMaxLength(1000);

            entity.Property(e => e.IsDefault)
                .HasColumnName("is_default")
                .IsRequired();

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");
        });

        // =====================================================
        // app_privilege
        // =====================================================
        modelBuilder.Entity<AppPrivilege>(entity =>
        {
            entity.ToTable("app_privilege");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.PrivilegeCode)
                .HasColumnName("privilege_code")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.PrivilegeName)
                .HasColumnName("privilege_name")
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(e => e.Description)
                .HasColumnName("description")
                .HasMaxLength(1000);

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.Property(e => e.CreatedBy)
                .HasColumnName("created_by")
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();

            entity.Property(e => e.UpdatedBy)
                .HasColumnName("updated_by");

            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at");
        });

        // =====================================================
        // app_user_role
        // =====================================================
        modelBuilder.Entity<AppUserRole>(entity =>
        {
            entity.ToTable("app_user_role");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.UserId)
                .HasColumnName("user_id")
                .IsRequired();

            entity.Property(e => e.RoleId)
                .HasColumnName("role_id")
                .IsRequired();

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.HasOne<AppUser>()
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne<AppRole>()
                .WithMany()
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =====================================================
        // app_role_privilege
        // =====================================================
        modelBuilder.Entity<AppRolePrivilege>(entity =>
        {
            entity.ToTable("app_role_privilege");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.RoleId)
                .HasColumnName("role_id")
                .IsRequired();

            entity.Property(e => e.PrivilegeCode)
                .HasColumnName("privilege_code")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.AccessLevel)
                .HasColumnName("access_level")
                .HasMaxLength(20)
                .IsRequired()
                .HasConversion<EnumToStringConverter<AccessLevel>>();

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.HasOne<AppRole>()
                .WithMany()
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =====================================================
        // app_login_history
        // =====================================================
        modelBuilder.Entity<AppLogin>(entity =>
        {
            entity.ToTable("app_user_login");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.UserId)
                .HasColumnName("user_id")
                .IsRequired();

            entity.Property(e => e.LoginDate)
                .HasColumnName("login_date")
                .IsRequired();

            entity.Property(e => e.LogoutDate)
                .HasColumnName("logout_date");

            entity.Property(e => e.AccessTokenId)
                .HasColumnName("access_token_id")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.AccessTokenExpiresAt)
                .HasColumnName("access_token_expires_at")
                .IsRequired();

            entity.Property(e => e.RefreshTokenId)
                .HasColumnName("refresh_token_id")
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.RefreshTokenExpiresAt)
                .HasColumnName("refresh_token_expires_at")
                .IsRequired();

            entity.Property(e => e.RefreshCount)
                .HasColumnName("refresh_count")
                .IsRequired();

            entity.Property(e => e.IpAddress)
                .HasColumnName("ip_address")
                .HasMaxLength(50);

            entity.Property(e => e.UserAgent)
                .HasColumnName("user_agent")
                .HasMaxLength(1000);

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active")
                .IsRequired();

            entity.HasOne<AppUser>()
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
