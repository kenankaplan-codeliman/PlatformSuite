using CodePro.Application.Features.Contracts.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Contracts.Commands.UpdateContract;

public sealed class UpdateContractCommand : ICommand<ContractDetailItem>, IAttachmentCarrier
{
    public Guid Id { get; init; }
    public string ContractNumber { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public ContractType Type { get; init; }
    public string CounterpartyName { get; init; } = string.Empty;
    public Guid? CounterpartyId { get; init; }
    public Guid? RelatedOfferId { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public ContractRenewalType RenewalType { get; init; }
    public decimal? Amount { get; init; }
    public ContractCurrency? Currency { get; init; }
    public ContractPaymentType? PaymentType { get; init; }
    public Guid ResponsibleUserId { get; init; }
    public string? AdditionalResponsibleUserIds { get; init; }
    public int ReminderDaysBefore { get; init; }
    public string? Notes { get; init; }
    public ContractStatus Status { get; init; }
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
