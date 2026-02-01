using CRM.Application.Modals.LeadModal;

namespace CRM.Api.Contracts.Requests.Lead
{
    public class LeadUpdateRequest
    {
        public Guid Id { get; set; }
        public LeadDetailItem Data { get; set; } = new LeadDetailItem();
    }
}
