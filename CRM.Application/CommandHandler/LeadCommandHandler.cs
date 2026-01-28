
using CRM.Application.Interfaces;
using CRM.Application.Modals.LeadModal;

namespace CRM.Application.CommandHandler
{
    public class LeadCommandHandler
    {
        private readonly ILeadRepository leadRepository;
        public LeadCommandHandler(ILeadRepository leadRepository) {
            this.leadRepository = leadRepository;
        }
        public async Task<LeadListResponse> List(LeadListFilter? filter, int page, int pageSize)
        {
            var list= await leadRepository.ListAsync(filter, page, pageSize);

            return list;
        }
    }
}
