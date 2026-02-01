using CRM.Application.Modals;
using CRM.Application.Modals.LeadModal;
using System;

namespace CRM.Api.Contracts.Requests.Lead;

public class LeadGetRequest
{
    public Guid Id { get; set; }
    
}
