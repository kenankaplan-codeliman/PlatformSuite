using Crm.Application.Features.Leads.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Queries.GetLead;

public sealed record GetLeadQuery(Guid Id) : IQuery<LeadDetailItem>;
