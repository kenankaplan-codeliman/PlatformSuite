using Platform.Application.Common.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Common.Parameters;

internal sealed class GeneralParameterReader : IGeneralParameterReader
{
    private readonly IApplicationDbContext _db;

    public GeneralParameterReader(IApplicationDbContext db) => _db = db;

    public Task<bool> ExistsAsync(string parentCode, string code, CancellationToken cancellationToken = default)
        => _db.GeneralParameter
            .AsNoTracking()
            .AnyAsync(p => p.IsActive && p.ParentCode == parentCode && p.Code == code, cancellationToken);
}
