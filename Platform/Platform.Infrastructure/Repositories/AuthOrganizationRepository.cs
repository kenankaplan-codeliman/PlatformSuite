using Platform.Application.Interfaces;
using Platform.Domain.Entities.Identities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Platform.Infrastructure.Repositories
{
    public class AuthOrganizationRepository : BaseEntityRepository<AuthOrganization>, IAuthOrganizationRepository
    {
        public AuthOrganizationRepository(PlatformDbContext dbContext) : base(dbContext)
        {
        }

        public override async Task<AuthOrganization?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
        {
            return await dbContext.AuthOrganization.FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);
        }

        public async Task<Dictionary<Guid, string>> GetOrganizationHierarchyAsync(
        Guid organizationId, CancellationToken cancellationToken = default)
        {
            var organizations = await dbContext.AuthOrganization
            .AsNoTracking()
            .Where(o => !o.IsDeleted && o.IsActive)
            .Select(o => new { o.Id, o.ParentOrganizationId, o.OrganizationName })
            .ToListAsync(cancellationToken);

            if (!organizations.Any(o => o.Id == organizationId))
                return new Dictionary<Guid, string>();

            var orgLookup = organizations.ToDictionary(o => o.Id);

            var childrenLookup = organizations
                .Where(o => o.ParentOrganizationId.HasValue)
                .GroupBy(o => o.ParentOrganizationId!.Value)
                .ToDictionary(g => g.Key, g => g.Select(o => o.Id).ToList());

            var result = new Dictionary<Guid, string>();
            var visited = new HashSet<Guid>();

            void Traverse(Guid orgId)
            {
                if (!orgLookup.ContainsKey(orgId) || !visited.Add(orgId))
                    return;

                var org = orgLookup[orgId];
                result.Add(org.Id, org.OrganizationName);

                if (!childrenLookup.TryGetValue(orgId, out var children))
                    return;

                foreach (var childId in children)
                    Traverse(childId);
            }

            Traverse(organizationId);
            return result;
        }

        public async Task<AuthOrganization?> GetDefaultOrganization(CancellationToken cancellationToken = default)
        {
            return await dbContext.AuthOrganization
            .AsNoTracking()
            .FirstOrDefaultAsync(o => !o.IsDeleted && o.IsDefault, cancellationToken);
        }

        public async Task<AuthOrganization> GetOrCreateDefaultOrganization(CancellationToken cancellationToken = default)
        {
            // Default organization Platform InitData/V001__Identity.sql tarafından seed edilir.
            // Migrator API başlamadan koştuğu için, normal akışta bu satır her zaman bir kayıt döner.
            // Bulunamazsa deployment problemi vardır (InitData henüz çalışmamış olabilir) — throw et.
            var defaultOrganization = await dbContext.AuthOrganization
                .Where(o => o.IsActive && !o.IsDeleted && o.IsDefault)
                .FirstOrDefaultAsync(cancellationToken);

            return defaultOrganization ?? throw new InvalidOperationException(
                "Default organization not found. InitData migration may not have completed.");
        }
    }
}
