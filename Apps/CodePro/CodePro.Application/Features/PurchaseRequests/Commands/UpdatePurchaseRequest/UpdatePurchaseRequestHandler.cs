using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseRequests.Commands.UpdatePurchaseRequest;

public sealed class UpdatePurchaseRequestHandler : IRequestHandler<UpdatePurchaseRequestCommand, Result<PurchaseRequestDetailItem>>
{
    private readonly IPurchaseRequestRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdatePurchaseRequestHandler(IPurchaseRequestRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PurchaseRequestDetailItem>> Handle(UpdatePurchaseRequestCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return PurchaseRequestErrors.NotFound;

        var numberExists = await _db.PurchaseRequest.AsNoTracking()
            .AnyAsync(p => p.Id != request.Id && p.RequestNumber.ToLower() == request.RequestNumber.ToLower(), cancellationToken);
        if (numberExists) return PurchaseRequestErrors.DuplicateRequestNumber;

        entity.RequestNumber = request.RequestNumber;
        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.Status = request.Status;
        entity.Priority = request.Priority;
        entity.RequestDate = request.RequestDate;
        entity.RequiredDate = request.RequiredDate;
        entity.CurrencyCode = request.CurrencyCode;
        entity.TotalAmount = PurchaseRequestSyncHelper.CalculateHeaderTotal(request.Lines);

        await _repository.UpdateAsync(entity, cancellationToken);

        await PurchaseRequestSyncHelper.SyncLinesAsync(_db, entity.Id, request.Lines, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        var detail = await PurchaseRequestDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return PurchaseRequestErrors.NotFound;
        return detail;
    }
}
