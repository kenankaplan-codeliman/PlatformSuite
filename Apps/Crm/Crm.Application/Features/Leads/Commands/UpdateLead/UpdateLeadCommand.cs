using Crm.Application.Common.Dtos.Communications;
using Crm.Application.Features.Leads.Dtos;
using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Leads.Commands.UpdateLead;

public sealed class UpdateLeadCommand : ICommand<LeadDetailItem>
{
    public Guid Id { get; init; }
    public string Subject { get; init; } = string.Empty;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Title { get; init; }
    public string? Department { get; init; }
    public string? Company { get; init; }
    public string? Industry { get; init; }
    public string? Website { get; init; }
    public string Source { get; init; } = "Other";
    public string Status { get; init; } = "New";
    public string? Rating { get; init; }
    public int? Score { get; init; }
    public decimal? EstimatedValue { get; init; }
    public string? EstimatedValueCurrency { get; init; }
    public string? Description { get; init; }

    public List<EmailModal> Emails { get; init; } = new();
    public List<PhoneModal> Phones { get; init; } = new();
    public List<AddressModal> Addresses { get; init; } = new();
}
