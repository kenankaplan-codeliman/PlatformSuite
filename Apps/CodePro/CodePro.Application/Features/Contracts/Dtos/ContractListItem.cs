using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Contracts.Dtos;

public class ContractListItem
{
    public Guid Id { get; set; }
    public string ContractNumber { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public ContractType Type { get; set; }
    public string CounterpartyName { get; set; } = default!;
    public ContractStatus Status { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? Amount { get; set; }
    public ContractCurrency? Currency { get; set; }
    public bool IsActive { get; set; }
}
