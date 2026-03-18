using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Accounts;
using CRM.Domain.Entities.Contacts;
using CRM.Domain.Entities.Identities;
using CRM.Domain.Entities.Leads;
using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Entities.Products;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.CommandHandler
{
    public class AuditCommandHandler
    {
        private readonly IAuditRepository auditRepository;

        public AuditCommandHandler(IAuditRepository auditRepository)
        {
            this.auditRepository = auditRepository;
        }

        public async Task<AuditInfo?> GetAsync(Guid id, EntityType entityType)
        {
            return entityType switch
            {
                EntityType.Account =>               await auditRepository.GetAsync<Account>(id),
                EntityType.Product =>               await auditRepository.GetAsync<Product>(id),
                EntityType.Contact =>               await auditRepository.GetAsync<Contact>(id),
                EntityType.Lead =>                  await auditRepository.GetAsync<Lead>(id),
                EntityType.Opportunity =>           await auditRepository.GetAsync<Opportunity>(id),
                EntityType.OpportunityProduct =>    await auditRepository.GetAsync<OpportunityProduct>(id),
                EntityType.User =>                  await auditRepository.GetAsync<AppUser>(id),

                _ => null
            };
        }
    }
}
