using CRM.Application.Models;

namespace CRM.Application.CommandHandler
{
    public class LeadCommandHandler
    {
        public LeadCommandHandler() { 

        }
        public async Task<LeadListResponse> List(LeadListFilter? filter, int page, int pageSize)
        {
            return new LeadListResponse();
        }
    }
}
