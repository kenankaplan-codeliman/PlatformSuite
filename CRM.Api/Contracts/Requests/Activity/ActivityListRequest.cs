using CRM.Application.Modals;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.LeadModal;
using System;

namespace CRM.Api.Contracts.Requests.Lead;

public class ActivityListRequest
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public ActivityListFilters Filters { get; set; } = new();

}
