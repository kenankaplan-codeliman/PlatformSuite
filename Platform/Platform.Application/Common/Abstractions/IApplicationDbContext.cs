using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Activities;
using Platform.Domain.Entities.Attachments;
using Platform.Domain.Entities.Contacts;
using Platform.Domain.Entities.Identities;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Common.Abstractions;

/// <summary>
/// Query handler'ların Infrastructure katmanına bağımlı olmadan EF sorguları
/// yazabilmesi için Application-seviyesi DbContext kontratı.
/// Property adları PlatformDbContext ile birebir aynı (singular).
/// </summary>
public interface IApplicationDbContext
{
    // Identity
    DbSet<AppOrganization> AppOrganization { get; }
    DbSet<AppUser> AppUser { get; }
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

    // Account
    DbSet<Account> Account { get; }
    DbSet<AccountEmail> AccountEmail { get; }
    DbSet<AccountPhone> AccountPhone { get; }
    DbSet<AccountAddress> AccountAddress { get; }
    DbSet<AccountContact> AccountContact { get; }

    // Contact
    DbSet<Contact> Contact { get; }
    DbSet<ContactEmail> ContactEmail { get; }
    DbSet<ContactPhone> ContactPhone { get; }
    DbSet<ContactAddress> ContactAddress { get; }

    // Attachment (Platform-seviye, tüm app'lerde paylaşılır)
    DbSet<AttachmentFileData> AttachmentFileData { get; }
    DbSet<AttachmentFileMetadata> AttachmentFileMetadata { get; }
    DbSet<AttachmentFileRelation> AttachmentFileRelation { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
