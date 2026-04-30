using Platform.Application.Exceptions;
using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Accounts;
using Platform.Domain.Entities.Contacts;
using Platform.Domain.Entities.Identities;
using Platform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.CommandHandler
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
                EntityType.Account => await auditRepository.GetAsync<Account>(id),
                EntityType.Contact => await auditRepository.GetAsync<Contact>(id),
                EntityType.User =>    await auditRepository.GetAsync<AppUser>(id),

                _ => null
            };
        }
    }
}
