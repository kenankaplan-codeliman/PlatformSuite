using Microsoft.EntityFrameworkCore;
using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.AppRoles.Dtos;
using MediatR;

namespace Platform.Application.Features.AppRoles.Queries.GetPrivilegeCatalog;

public sealed class GetPrivilegeCatalogHandler
    : IRequestHandler<GetPrivilegeCatalogQuery, Result<List<PrivilegeCatalogGroup>>>
{
    private readonly IApplicationDbContext _db;

    public GetPrivilegeCatalogHandler(IApplicationDbContext db) => _db = db;

    public async Task<Result<List<PrivilegeCatalogGroup>>> Handle(
        GetPrivilegeCatalogQuery request,
        CancellationToken cancellationToken)
    {
        // Katalog kaynağı auth_privilege tablosudur (statik PrivilegeRegistry değil):
        // DB'ye eklenen/seed edilen her privilege otomatik olarak rol ekranında görünür.
        // Kod "<Entity>.<Action>" formatında olduğundan entity bazında gruplanır.
        var privileges = await _db.AuthPrivilege
            .Where(p => p.IsActive)
            .OrderBy(p => p.PrivilegeCode)
            .Select(p => new { p.PrivilegeCode, p.PrivilegeName })
            .ToListAsync(cancellationToken);

        var groups = privileges
            .Select(p => new
            {
                Code = p.PrivilegeCode,
                Name = p.PrivilegeName,
                Entity = SplitEntity(p.PrivilegeCode),
                Action = SplitAction(p.PrivilegeCode),
            })
            .GroupBy(x => x.Entity)
            .OrderBy(g => g.Key, StringComparer.Ordinal)
            .Select(g => new PrivilegeCatalogGroup
            {
                Entity = g.Key,
                Privileges = g
                    .Select(x => new PrivilegeCatalogEntry
                    {
                        Code = x.Code,
                        Action = x.Action,
                        Name = x.Name,
                    })
                    .ToList(),
            })
            .ToList();

        return groups;
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
