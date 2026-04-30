using CodePro.Application.Features.Contracts.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Contracts.Queries.GetContract;

public sealed record GetContractQuery(Guid Id) : IQuery<ContractDetailItem>;
