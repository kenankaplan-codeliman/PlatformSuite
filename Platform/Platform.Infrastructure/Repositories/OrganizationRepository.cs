using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Identities;
using Platform.Infrastructure.Data;
using Platform.Infrastructure.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Infrastructure.Repositories
{
    public class OrganizationRepository : BaseEntityRepository<Organization>, IOrganizationRepository
    {

        private readonly IConfiguration config;

        public OrganizationRepository(PlatformDbContext dbContext,
            IConfiguration config) : base(dbContext)
        {
            this.config = config;
        }

        public override async Task<Organization?> GetAsync(Guid Id, CancellationToken cancellationToken = default)
        {
            return await dbContext.Organization.FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);
        }

        public async Task<Dictionary<Guid, string>> GetOrganizationHierarchyAsync(
        Guid organizationId, CancellationToken cancellationToken = default)
        {
            var organizations = await dbContext.Organization
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

        public async Task<Organization?> GetDefaultOrganization(CancellationToken cancellationToken = default)
        {
            return await dbContext.Organization
            .AsNoTracking()
            .FirstOrDefaultAsync(o => !o.IsDeleted && o.IsDefault, cancellationToken);
        }

        public async Task<Organization> GetOrCreateDefaultOrganization(CancellationToken cancellationToken = default)
        {
            var defaultOrganization = await dbContext.Organization
            .Where(o => o.IsActive && !o.IsDeleted && o.IsDefault)
            .FirstOrDefaultAsync(cancellationToken);

            if (defaultOrganization != null)
                return defaultOrganization;

            defaultOrganization = new Organization
            {
                OrganizationCode = config["DefaultValues:Default_Organization_Code"]
                    ?? throw new InvalidOperationException("Default_Organization_Code is not configured."),
                OrganizationName = config["DefaultValues:Default_Organization_Name"]
                    ?? throw new InvalidOperationException("Default_Organization_Name is not configured."),
                IsDefault = true
            };

            dbContext.Organization.Add(defaultOrganization);
            await dbContext.SaveChangesAsync(cancellationToken);

            return defaultOrganization;
        }
    }
}
