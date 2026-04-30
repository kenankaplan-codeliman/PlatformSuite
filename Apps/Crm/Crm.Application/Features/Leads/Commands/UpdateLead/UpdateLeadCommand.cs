using Crm.Application.Features.Leads.Dtos;
using Crm.Domain.Enums;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Commands.UpdateLead;

public sealed class UpdateLeadCommand : ICommand<LeadDetailItem>
{
    public Guid Id { get; init; }
    public string Subject { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Company { get; init; }
    public string? Title { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Website { get; init; }
    public LeadSource Source { get; init; }
    public LeadStatus Status { get; init; }
    public int? Score { get; init; }
    public decimal? EstimatedValue { get; init; }
    public string? Description { get; init; }
}
