using Platform.Application.Common.Abstractions;
using Crm.Application.Interfaces;
using Crm.Application.Common.Communications;
using Platform.Application.Common.Results;
using Crm.Application.Features.Accounts.Dtos;
using Crm.Domain.Entities.Accounts;
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

        var dto = entity.Adapt<AccountDetailItem>();
        (dto.Emails, dto.Phones, dto.Addresses) =
            await _db.LoadCommunicationsAsync(nameof(Account), entity.Id, cancellationToken);
        return dto;
    }
}
