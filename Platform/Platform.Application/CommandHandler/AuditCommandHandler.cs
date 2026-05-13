using Platform.Application.Interfaces;
using Platform.Application.Modals.Common;
using Platform.Domain.Entities.Identities;

namespace Platform.Application.CommandHandler
{
    /// <summary>
    /// Platform-seviyesi audit dispatcher. Yalnızca platform-merkezli entity'ler
    /// (User vb.) için audit lookup destekler. CRM/CodePro entity'leri (Account,
    /// Contact, Lead, Opportunity, Supplier vb.) için audit her uygulamanın kendi
    /// command handler'ı tarafından çözümlenir.
    /// </summary>
    public class AuditCommandHandler
    {
        private readonly IAuditRepository auditRepository;

        public AuditCommandHandler(IAuditRepository auditRepository)
        {
            this.auditRepository = auditRepository;
        }

        public async Task<AuditInfo?> GetAsync(Guid id, string entityType)
        {
            return entityType switch
            {
                nameof(AuthUser) => await auditRepository.GetAsync<AuthUser>(id),

                _ => null
            };
        }
    }
}
