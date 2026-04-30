using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppUsers.Dtos;

namespace Platform.Application.Features.AppUsers.Queries.GetAppUser;

public sealed record GetAppUserQuery(Guid Id) : IQuery<AppUserDetailItem>;
