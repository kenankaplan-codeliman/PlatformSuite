using CRM.Application.Interfaces;
using CRM.Domain.Entities.Identity;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
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

        public async Task<AppOrganization?> GetDefaultAsync()
        {
            return await dbContext.AppOrganization.FirstOrDefaultAsync(x => x.IsDefault );
        }

        public async Task CreateAsync(AppOrganization entity)
        {
            await dbContext.AppOrganization.AddAsync(entity);
            await dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(AppOrganization entity)
        {
            dbContext.AppOrganization.Update(entity);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(AppOrganization entity)
        {
            dbContext.AppOrganization.Remove(entity);
            await dbContext.SaveChangesAsync();
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
