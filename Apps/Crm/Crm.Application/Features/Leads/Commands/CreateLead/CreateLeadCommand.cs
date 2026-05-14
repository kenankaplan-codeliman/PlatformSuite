using Crm.Application.Features.Leads.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Commands.CreateLead;

public sealed class CreateLeadCommand : ICommand<LeadDetailItem>
{
    public string Subject { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Company { get; init; }
    public string? Title { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Website { get; init; }
    public string Source { get; init; } = "Other";
    public string Status { get; init; } = "New";
    public int? Score { get; init; }
    public decimal? EstimatedValue { get; init; }
    public string? Description { get; init; }
}
