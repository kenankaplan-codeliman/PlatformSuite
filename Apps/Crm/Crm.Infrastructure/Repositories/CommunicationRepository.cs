using Crm.Application.Common.Dtos.Communications;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Communications;
using Crm.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Crm.Infrastructure.Repositories;

/// <summary>
/// Polimorfik owner (ParentEntityType + ParentEntityId) üzerinden CRM iletişim
/// kayıtlarını (email/phone/address) merge eder. Email/Phone/Address aggregate navigation
/// olmadığı için eski <c>CollectionSync.Merge</c> mantığı buraya, EF dbSet Add/Remove ile
/// çalışacak şekilde taşındı. Remove → PlatformDbContext.ApplySaveRules tarafından
/// soft-delete'e çevrilir.
/// </summary>
public class CommunicationRepository : ICommunicationRepository
{
    private readonly CrmDbContext _db;

    public CommunicationRepository(CrmDbContext db) => _db = db;

    public async Task SyncAsync(
        string parentEntityType,
        Guid parentEntityId,
        IReadOnlyList<EmailModal> emails,
        IReadOnlyList<PhoneModal> phones,
        IReadOnlyList<AddressModal> addresses,
        CancellationToken cancellationToken = default)
    {
        await MergeAsync(
            _db.EmailAddress, parentEntityType, parentEntityId,
            emails, dto => dto.Id, () => new EmailAddress(),
            (dto, e) =>
            {
                e.Email = dto.Email;
                e.Type = dto.Type;
                e.IsPrimary = dto.IsPrimary;
            },
            cancellationToken);

        await MergeAsync(
            _db.Phone, parentEntityType, parentEntityId,
            phones, dto => dto.Id, () => new Phone(),
            (dto, p) =>
            {
                p.PhoneNumber = dto.PhoneNumber;
                p.Type = dto.Type;
                p.IsPrimary = dto.IsPrimary;
            },
            cancellationToken);

        await MergeAsync(
            _db.Address, parentEntityType, parentEntityId,
            addresses, dto => dto.Id ?? Guid.Empty, () => new Address(),
            (dto, a) =>
            {
                a.AddressLine1 = dto.AddressLine1;
                a.AddressLine2 = dto.AddressLine2;
                a.CountryCode = dto.CountryCode;
                a.CountryName = dto.CountryName;
                a.CityCode = dto.CityCode;
                a.CityName = dto.CityName;
                a.DistrictCode = dto.DistrictCode;
                a.DistrictName = dto.DistrictName;
                a.State = dto.State;
                a.PostalCode = dto.PostalCode;
                a.Type = dto.Type;
                a.IsPrimary = dto.IsPrimary;
            },
            cancellationToken);

        await _db.SaveChangesAsync(cancellationToken);
    }

    private async Task MergeAsync<TEntity, TDto>(
        DbSet<TEntity> set,
        string parentEntityType,
        Guid parentEntityId,
        IReadOnlyList<TDto> incoming,
        Func<TDto, Guid> getDtoId,
        Func<TEntity> factory,
        Action<TDto, TEntity> apply,
        CancellationToken cancellationToken)
        where TEntity : class, ICommunication
    {
        var existing = await set
            .Where(e => e.ParentEntityType == parentEntityType && e.ParentEntityId == parentEntityId)
            .ToListAsync(cancellationToken);

        var incomingIds = incoming
            .Select(getDtoId)
            .Where(id => id != Guid.Empty)
            .ToHashSet();

        // DTO'da olmayan mevcut kayıtlar silinir (soft-delete).
        foreach (var entity in existing)
        {
            if (!incomingIds.Contains(entity.Id))
                set.Remove(entity);
        }

        foreach (var dto in incoming)
        {
            var id = getDtoId(dto);
            var match = id != Guid.Empty ? existing.FirstOrDefault(e => e.Id == id) : null;

            if (match is null)
            {
                var entity = factory();
                entity.ParentEntityType = parentEntityType;
                entity.ParentEntityId = parentEntityId;
                apply(dto, entity);
                await set.AddAsync(entity, cancellationToken);
            }
            else
            {
                apply(dto, match);
            }
        }
    }
}
