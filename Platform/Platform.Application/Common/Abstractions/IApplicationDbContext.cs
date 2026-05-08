using Platform.Domain.Entities.Activities;
using Platform.Domain.Entities.Attachments;
using Platform.Domain.Entities.Identities;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Common.Abstractions;

/// <summary>
/// Query handler'ların Infrastructure katmanına bağımlı olmadan EF sorguları
/// yazabilmesi için Application-seviyesi DbContext kontratı.
/// Property adları PlatformDbContext ile birebir aynı (singular).
/// Account/Contact gibi uygulamaya özgü entity'ler ICrmDbContext gibi alt
/// kontratlara taşınmıştır.
/// </summary>
public interface IApplicationDbContext
{
    // Identity
    DbSet<Organization> Organization { get; }
    DbSet<User> User { get; }
    DbSet<AppRole> AppRole { get; }
    DbSet<AppPrivilege> AppPrivilege { get; }
    DbSet<AppUserRole> AppUserRole { get; }
    DbSet<AppRolePrivilege> AppRolePrivilege { get; }
    DbSet<AppLogin> AppLogin { get; }

    // Activity
    DbSet<ActivityBase> Activity { get; }
    DbSet<ActivityParty> ActivityParty { get; }
    DbSet<EmailActivity> EmailActivity { get; }
    DbSet<PhoneCallActivity> PhoneCallActivity { get; }
    DbSet<TaskActivity> TaskActivity { get; }
    DbSet<AppointmentActivity> AppointmentActivity { get; }

    // Attachment (Platform-seviye, tüm app'lerde paylaşılır)
    DbSet<AttachmentFileData> AttachmentFileData { get; }
    DbSet<AttachmentFileMetadata> AttachmentFileMetadata { get; }
    DbSet<AttachmentFileRelation> AttachmentFileRelation { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
