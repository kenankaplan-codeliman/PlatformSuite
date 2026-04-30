using CodePro.Domain.Enums;

namespace CodePro.Application.Features.Contracts.Dtos;

public class ContractListFilter
{
    public string? Search { get; set; }
    public ContractType? Type { get; set; }
    public ContractStatus? Status { get; set; }
    public bool? IsActive { get; set; }
}
