using CodePro.Application.Features.Contracts.Dtos;
using CodePro.Domain.Enums;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Attachments;

namespace CodePro.Application.Features.Contracts.Commands.CreateContract;

public sealed class CreateContractCommand : ICommand<ContractDetailItem>, IAttachmentCarrier
{
    public string ContractNumber { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public ContractType Type { get; init; }
    public string CounterpartyName { get; init; } = string.Empty;
    public Guid? CounterpartyId { get; init; }
    public Guid? RelatedOfferId { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public ContractRenewalType RenewalType { get; init; } = ContractRenewalType.None;
    public decimal? Amount { get; init; }
    public ContractCurrency? Currency { get; init; }
    public ContractPaymentType? PaymentType { get; init; }
    public Guid ResponsibleUserId { get; init; }
    public string? AdditionalResponsibleUserIds { get; init; }
    public int ReminderDaysBefore { get; init; } = 30;
    public string? Notes { get; init; }
    public List<AttachmentAssociation> Attachments { get; init; } = new();
}
