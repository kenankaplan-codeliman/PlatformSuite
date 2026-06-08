namespace Crm.Application.Features.Leads.Dtos;

/// <summary>
/// Convert sonucu — oluşturulan/bağlanan kayıtların id'leri. Client bu id'lere
/// göre yeni Account/Contact/Opportunity detayına yönlendirebilir.
/// </summary>
public class ConvertLeadResult
{
    public Guid LeadId { get; set; }
    public Guid? AccountId { get; set; }
    public Guid? ContactId { get; set; }
    public Guid? OpportunityId { get; set; }
}
