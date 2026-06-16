using Platform.Application.Common.Results;
using Platform.Application.Features.AppRoles.Dtos;
using Platform.Domain.Authorization;
using MediatR;

namespace Platform.Application.Features.AppRoles.Queries.GetPrivilegeCatalog;

public sealed class GetPrivilegeCatalogHandler
    : IRequestHandler<GetPrivilegeCatalogQuery, Result<List<PrivilegeCatalogGroup>>>
{
    public Task<Result<List<PrivilegeCatalogGroup>>> Handle(
        GetPrivilegeCatalogQuery request,
        CancellationToken cancellationToken)
    {
        var groups = PrivilegeRegistry.All
            .Select(code => new
            {
                Code = code,
                Entity = SplitEntity(code),
                Action = SplitAction(code),
            })
            .GroupBy(x => x.Entity)
            .OrderBy(g => g.Key, StringComparer.Ordinal)
            .Select(g => new PrivilegeCatalogGroup
            {
                Entity = g.Key,
                Privileges = g
                    .OrderBy(x => x.Action, StringComparer.Ordinal)
                    .Select(x => new PrivilegeCatalogEntry { Code = x.Code, Action = x.Action })
                    .ToList(),
            })
            .ToList();

        return Task.FromResult<Result<List<PrivilegeCatalogGroup>>>(groups);
    }

    private static string SplitEntity(string code)
    {
        var idx = code.IndexOf('.');
        return idx < 0 ? code : code[..idx];
    }

    private static string SplitAction(string code)
    {
        var idx = code.IndexOf('.');
        return idx < 0 ? code : code[(idx + 1)..];
    }
}
