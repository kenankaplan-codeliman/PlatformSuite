using CodePro.Application.Features.PurchaseRequests.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.PurchaseRequests;
using CodePro.Domain.Enums;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.PurchaseRequests.Commands.CreatePurchaseRequest;

public sealed class CreatePurchaseRequestHandler : IRequestHandler<CreatePurchaseRequestCommand, Result<PurchaseRequestDetailItem>>
{
    private readonly IPurchaseRequestRepository _repository;
    private readonly ICodeProDbContext _db;

    public CreatePurchaseRequestHandler(IPurchaseRequestRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<PurchaseRequestDetailItem>> Handle(CreatePurchaseRequestCommand request, CancellationToken cancellationToken)
    {
        var requestNumber = string.IsNullOrWhiteSpace(request.RequestNumber)
            ? await GenerateRequestNumberAsync(cancellationToken)
            : request.RequestNumber.Trim();

        var numberExists = await _db.PurchaseRequest.AsNoTracking()
            .AnyAsync(p => p.RequestNumber.ToLower() == requestNumber.ToLower(), cancellationToken);
        if (numberExists) return PurchaseRequestErrors.DuplicateRequestNumber;

        var entity = new PurchaseRequest
        {
            RequestNumber = requestNumber,
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            Status = PurchaseRequestStatus.Setup,
            RequestDate = request.RequestDate,
            RequiredDate = request.RequiredDate,
            CurrencyCode = request.CurrencyCode,
            TotalAmount = PurchaseRequestSyncHelper.CalculateHeaderTotal(request.Lines),
        };
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Lines.Count > 0)
        {
            await PurchaseRequestSyncHelper.SyncLinesAsync(_db, entity.Id, request.Lines, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
        }

        var detail = await PurchaseRequestDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return PurchaseRequestErrors.NotFound;
        return detail;
    }

    private async Task<string> GenerateRequestNumberAsync(CancellationToken cancellationToken)
    {
        var year = DateTime.UtcNow.Year;
        var prefix = $"PR-{year}-";
        var lastNumber = await _db.PurchaseRequest.AsNoTracking()
            .Where(p => p.RequestNumber.StartsWith(prefix))
            .OrderByDescending(p => p.RequestNumber)
            .Select(p => p.RequestNumber)
            .FirstOrDefaultAsync(cancellationToken);

        var nextNumber = 1;
        if (!string.IsNullOrEmpty(lastNumber))
        {
            var suffix = lastNumber.Substring(prefix.Length);
            if (int.TryParse(suffix, out var n)) nextNumber = n + 1;
        }
        return $"{prefix}{nextNumber:D4}";
    }
}
