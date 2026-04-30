using CodePro.Application.Features.Contracts.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Contracts.Queries.GetContract;

public sealed class GetContractHandler : IRequestHandler<GetContractQuery, Result<ContractDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetContractHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<ContractDetailItem>> Handle(GetContractQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.Contract.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
        if (entity is null) return ContractErrors.NotFound;
        return entity.Adapt<ContractDetailItem>();
    }
}
