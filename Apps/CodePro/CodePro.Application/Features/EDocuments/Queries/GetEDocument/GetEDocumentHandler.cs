using CodePro.Application.Features.EDocuments.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.EDocuments.Queries.GetEDocument;

public sealed class GetEDocumentHandler : IRequestHandler<GetEDocumentQuery, Result<EDocumentDetailItem>>
{
    private readonly ICodeProDbContext _db;

    public GetEDocumentHandler(ICodeProDbContext db) => _db = db;

    public async Task<Result<EDocumentDetailItem>> Handle(GetEDocumentQuery request, CancellationToken cancellationToken)
    {
        var entity = await _db.EDocument.AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);
        if (entity is null) return EDocumentErrors.NotFound;
        return entity.Adapt<EDocumentDetailItem>();
    }
}
