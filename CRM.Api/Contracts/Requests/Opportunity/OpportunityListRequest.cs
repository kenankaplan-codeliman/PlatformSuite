namespace CRM.Application.Modals.OpportunityModal;

public class OpportunityListRequest
{
    public int Page { get; set; }

    public int PageSize { get; set; }

    public OpportunityListFilters Filters { get; set; } = new();
}