using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Identities;
using CRM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class OrganizationRepository : IOrganizationRepository
    {
        private readonly DatabaseContext dbContext;
        private readonly IConfiguration config;

        public OrganizationRepository(DatabaseContext dbContext, IConfiguration config)
        {
            this.dbContext = dbContext;
            this.config = config;
        }

        public AppOrganization Get(Guid Id)
        {
            return dbContext.AppOrganization.FirstOrDefault(x => x.Id == Id) ?? throw new NotFoundException();
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

        public AppOrganization? GetDefaultOrganization()
        {
            return dbContext.AppOrganization
                .IgnoreQueryFilters()
                .AsNoTracking()
                .FirstOrDefault(o => !o.IsDeleted && o.IsDefault);
        }

        public async Task<AppOrganization> GetOrCreateDefaultOrganization()
        {
            var defaultOrganization = dbContext.AppOrganization
                               .IgnoreQueryFilters()
                               .AsNoTracking()
                               .Where(o => o.IsActive && !o.IsDeleted && o.IsDefault)
                               .FirstOrDefault();

            if (defaultOrganization != null)
                return defaultOrganization;

            defaultOrganization = new AppOrganization()
            {
                OrganizationCode = config["DefaultValues:Default_Organization_Code"]!,
                OrganizationName = config["DefaultValues:Default_Organization_Name"]!,
                IsDefault = true
            };

            dbContext.AppOrganization.Add(defaultOrganization);
            dbContext.SaveChanges();

            return defaultOrganization;
        }
    }
}
