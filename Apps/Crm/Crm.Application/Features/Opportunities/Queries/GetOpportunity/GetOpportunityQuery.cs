using Crm.Application.Features.Opportunities.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Opportunities.Queries.GetOpportunity;

public sealed record GetOpportunityQuery(Guid Id) : IQuery<OpportunityDetailItem>;
