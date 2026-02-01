using CRM.Application.Modals;
using CRM.Application.Modals.LeadModal;
using System;

namespace CRM.Api.Contracts.Requests;

public class LeadGetRequest
{
    public Guid Id { get; set; }
    
}
