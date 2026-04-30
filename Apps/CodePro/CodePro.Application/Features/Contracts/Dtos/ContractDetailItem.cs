using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Contracts.Dtos;

public class ContractDetailItem
{
    public Guid Id { get; set; }
    public string ContractNumber { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public ContractType Type { get; set; }
    public string CounterpartyName { get; set; } = default!;
    public Guid? CounterpartyId { get; set; }
    public Guid? RelatedOfferId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public ContractRenewalType RenewalType { get; set; }
    public decimal? Amount { get; set; }
    public ContractCurrency? Currency { get; set; }
    public ContractPaymentType? PaymentType { get; set; }
    public Guid ResponsibleUserId { get; set; }
    public string? AdditionalResponsibleUserIds { get; set; }
    public int ReminderDaysBefore { get; set; }
    public string? Notes { get; set; }
    public ContractStatus Status { get; set; }
    public DateTime? SentToCounterpartyAt { get; set; }
    public DateTime? SignedAt { get; set; }
    public DateTime? LastReminderSentAt { get; set; }
    public bool IsActive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
