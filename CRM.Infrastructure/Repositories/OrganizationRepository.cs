using CRM.Application.Interfaces;
using CRM.Domain.Entities.Identity;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class OrganizationRepository : IOrganizationRepository
    {
        private readonly DatabaseContext dbContext;

        public OrganizationRepository(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<AppOrganization?> GetAsync(Guid Id)
        {
            return await dbContext.AppOrganization.FirstOrDefaultAsync(x => x.Id == Id);
        }

        public async Task<AppOrganization?> GetDefaultOrganizationAsync()
        {
            return await dbContext.AppOrganization.FirstOrDefaultAsync(x => x.IsDefault );
        }

        public async Task<AppOrganization> CreateAsync(AppOrganization entity)
        {
            var entry = await dbContext.AppOrganization.AddAsync(entity);
            return entry.Entity;
            
        }

        public async Task<AppOrganization> UpdateAsync(AppOrganization entity)
        {
            var entry = dbContext.AppOrganization.Update(entity);
            return entry.Entity;
        }

        public async Task<AppOrganization> DeleteAsync(AppOrganization entity)
        {
            var entry = dbContext.AppOrganization.Remove(entity);
            return entry.Entity;
        }


        public async Task<List<Guid>> GetOrganizationHierarchy(Guid organizationId)
        {
            
            var organizations = await dbContext.AppOrganization
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Where(o => !o.IsDeleted && o.IsActive)
                .Select(o => new
                {
                    o.Id,
                    o.ParentOrganizationId
                })
                .ToListAsync();

            if (!organizations.Any(o => o.Id == organizationId))
            {
                return new List<Guid>(); 
            }

            var result = new HashSet<Guid>();

            void Traverse(Guid orgId)
            {
                if (!result.Add(orgId))
                    return;

                var children = organizations
                    .Where(o => o.ParentOrganizationId == orgId)
                    .Select(o => o.Id);

                foreach (var childId in children)
                {
                    Traverse(childId);
                }
            }

            Traverse(organizationId);

            return result.ToList();
        }

    }
}
