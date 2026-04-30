using Platform.Application.Common.Abstractions;
using Platform.Application.Features.AppOrganizations.Dtos;

namespace Platform.Application.Features.AppOrganizations.Queries.GetAppOrganization;

public sealed record GetAppOrganizationQuery(Guid Id) : IQuery<AppOrganizationDetailItem>;
