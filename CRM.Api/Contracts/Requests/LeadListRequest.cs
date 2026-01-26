using CRM.Application.Models;
using System;

namespace CRM.Api.Contracts.Requests;

public class LeadListRequest
{
  public int page { get; set; }
  public int pageSize { get; set; }
  public LeadListFilter? filters { get; set; }
    
}
