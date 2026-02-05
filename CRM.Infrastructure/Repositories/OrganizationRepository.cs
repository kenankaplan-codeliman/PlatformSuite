using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
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

        public AppOrganization Get(Guid Id)
        {
            return dbContext.AppOrganization.FirstOrDefault(x => x.Id == Id) ?? throw new NotFoundException();
        }

        public AppOrganization? GetDefaultOrganization()
        {
            return dbContext.AppOrganization.FirstOrDefault(x => x.IsDefault );
        }

        public AppOrganization Create(AppOrganization entity)
        {
            var entry = dbContext.AppOrganization.Add(entity);
            return entry.Entity;
            
        }

        public AppOrganization Update(AppOrganization entity)
        {
            var entry = dbContext.AppOrganization.Update(entity);
            return entry.Entity;
        }

        public AppOrganization Delete(AppOrganization entity)
        {
            var entry = dbContext.AppOrganization.Remove(entity);
            return entry.Entity;
        }


        public Dictionary<Guid, string> GetOrganizationHierarchy(Guid organizationId)
        {
            var organizations = dbContext.AppOrganization
                .IgnoreQueryFilters()
                .AsNoTracking()
                .Where(o => !o.IsDeleted && o.IsActive)
                .Select(o => new
                {
                    o.Id,
                    o.ParentOrganizationId,
                    o.OrganizationName
                })
                .ToList();

            if (!organizations.Any(o => o.Id == organizationId))
            {
                return new Dictionary<Guid, string>();
            }

            // Performans için lookup dictionary
            var orgLookup = organizations.ToDictionary(o => o.Id);

            var result = new Dictionary<Guid, string>();

            void Traverse(Guid orgId)
            {
                if (!orgLookup.ContainsKey(orgId))
                    return;

                if (result.ContainsKey(orgId))
                    return;

                var org = orgLookup[orgId];
                result.Add(org.Id, org.OrganizationName);

                var children = organizations
                    .Where(o => o.ParentOrganizationId == orgId)
                    .Select(o => o.Id);

                foreach (var childId in children)
                {
                    Traverse(childId);
                }
            }

            Traverse(organizationId);

            return result;
        }
    }
}
