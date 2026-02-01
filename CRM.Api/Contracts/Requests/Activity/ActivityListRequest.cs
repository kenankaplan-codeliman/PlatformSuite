using CRM.Application.Modals;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.LeadModal;
using System;

namespace CRM.Api.Contracts.Requests.Lead;

public class ActivityListRequest
{
  public int page { get; set; }
  public int pageSize { get; set; }
  public ActivityListFilters? filters { get; set; }
    
}
