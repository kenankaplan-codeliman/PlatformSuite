using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Crm.Application.Features.Accounts.Dtos;
using Mapster;
using MapsterMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Crm.Application.Features.Accounts;

namespace Crm.Application.Features.Accounts.Queries.GetAccount;

public sealed class GetAccountHandler : IRequestHandler<GetAccountQuery, Result<AccountDetailItem>>
{
    private readonly ICrmDbContext _db;
    private readonly IMapper _mapper;

    public GetAccountHandler(ICrmDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<Result<AccountDetailItem>> Handle(GetAccountQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Account
            .AsNoTracking()
            .WithDetailIncludes()
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (entity is null) return AccountErrors.NotFound;

        return entity.Adapt<AccountDetailItem>();
    }
}
