using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppRoles.Dtos;

namespace Platform.Application.Features.AppRoles.Queries.GetAppRole;

public sealed record GetAppRoleQuery(Guid Id) : IQuery<AppRoleDetailItem>;
