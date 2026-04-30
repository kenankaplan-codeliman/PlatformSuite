using Platform.Application.Common.Abstractions;
using Platform.Application.Common.Results;
using Platform.Application.Features.Accounts.Dtos;
using Mapster;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Platform.Application.Features.Accounts.Queries.GetAccount;

public sealed class GetAccountHandler : IRequestHandler<GetAccountQuery, Result<AccountDetailItem>>
{
    private readonly IApplicationDbContext _db;
    private readonly IMapper _mapper;

    public GetAccountHandler(IApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<Result<AccountDetailItem>> Handle(GetAccountQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Account
            .AsNoTracking()
            .Include(a => a.ParentAccount)
            .Include(a => a.Emails)
            .Include(a => a.Phones)
            .Include(a => a.Addresses)
            .Include(a => a.AccountContacts).ThenInclude(ac => ac.Contact)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (entity is null) return AccountErrors.NotFound;

        return entity.Adapt<AccountDetailItem>();
    }
}
