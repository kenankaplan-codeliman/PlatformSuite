using Platform.Domain.Entities.Activities;
using Platform.Domain.Entities.Attachments;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Entities.Parameters;
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
    DbSet<AuthOrganization> AuthOrganization { get; }
    DbSet<AuthUser> AuthUser { get; }
    DbSet<AuthRole> AuthRole { get; }
    DbSet<AuthPrivilege> AuthPrivilege { get; }
    DbSet<AuthUserRole> AuthUserRole { get; }
    DbSet<AuthRolePrivilege> AuthRolePrivilege { get; }
    DbSet<AuthUserLogin> AuthUserLogin { get; }

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

    // GeneralParameter (Platform-seviye, dinamik enum/parametre verisi)
    DbSet<GeneralParameter> GeneralParameter { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
