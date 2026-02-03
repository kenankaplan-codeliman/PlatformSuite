using CRM.Application.Modals;
using CRM.Application.Modals.LeadModal;
using System;

namespace CRM.Api.Contracts.Requests.Lead;

public class LeadListRequest
{
  public int Page { get; set; }
  public int PageSize { get; set; }
  public LeadListFilter? filters { get; set; }= new LeadListFilter();
    
}
