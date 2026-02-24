namespace CRM.Application.Modals.OpportunityModal;

public class OpportunityListResponse
{
    public List<OpportunityListItem> Data { get; set; } = [];

    public bool HasMore { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }
}