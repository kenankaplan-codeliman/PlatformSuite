using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.UserPreferences.Dtos;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.UserPreferences.Queries.GetUserPreference;

public sealed class GetUserPreferenceHandler
    : IRequestHandler<GetUserPreferenceQuery, Result<UserPreferenceItem>>
{
    private readonly IApplicationDbContext _db;
    private readonly IContextUser _contextUser;

    public GetUserPreferenceHandler(IApplicationDbContext db, IContextUser contextUser)
    {
        _db = db;
        _contextUser = contextUser;
    }

    public async Task<Result<UserPreferenceItem>> Handle(GetUserPreferenceQuery request, CancellationToken cancellationToken)
    {
        // Org/All erişimli kullanıcılar için OwnerId explicit filtrelenir.
        var value = await _db.UserPreference.AsNoTracking()
            .Where(p => p.OwnerId == _contextUser.UserId && p.PreferenceKey == request.Key)
            .Select(p => p.Value)
            .FirstOrDefaultAsync(cancellationToken);

        return new UserPreferenceItem { Key = request.Key, Value = value };
    }
}
