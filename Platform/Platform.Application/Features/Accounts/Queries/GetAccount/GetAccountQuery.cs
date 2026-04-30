using Platform.Application.Common.Abstractions;
using Platform.Application.Features.Accounts.Dtos;

namespace Platform.Application.Features.Accounts.Queries.GetAccount;

public sealed record GetAccountQuery(Guid Id) : IQuery<AccountDetailItem>;
