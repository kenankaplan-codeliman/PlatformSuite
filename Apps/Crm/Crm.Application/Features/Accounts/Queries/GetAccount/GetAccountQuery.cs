using Platform.Application.Common.Abstractions;
using Crm.Application.Features.Accounts.Dtos;

namespace Crm.Application.Features.Accounts.Queries.GetAccount;

public sealed record GetAccountQuery(Guid Id) : IQuery<AccountDetailItem>;
