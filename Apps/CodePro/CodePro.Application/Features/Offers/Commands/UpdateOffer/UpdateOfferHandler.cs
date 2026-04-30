using CodePro.Application.Features.Offers.Dtos;
using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Offers.Commands.UpdateOffer;

public sealed class UpdateOfferHandler : IRequestHandler<UpdateOfferCommand, Result<OfferDetailItem>>
{
    private readonly IOfferRepository _repository;
    private readonly ICodeProDbContext _db;

    public UpdateOfferHandler(IOfferRepository repository, ICodeProDbContext db)
    {
        _repository = repository;
        _db = db;
    }

    public async Task<Result<OfferDetailItem>> Handle(UpdateOfferCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return OfferErrors.NotFound;

        var numberExists = await _db.Offer.AsNoTracking()
            .AnyAsync(o => o.Id != request.Id && o.OfferNumber.ToLower() == request.OfferNumber.ToLower(), cancellationToken);
        if (numberExists) return OfferErrors.DuplicateOfferNumber;

        var totals = OfferSyncHelper.CalculateTotals(request.Items, request.DiscountPercentage);

        entity.OfferNumber = request.OfferNumber;
        entity.OfferType = request.OfferType;
        entity.Subject = request.Subject;
        entity.CounterpartyName = request.CounterpartyName;
        entity.CounterpartyId = request.CounterpartyId;
        entity.ResponsibleUserId = request.ResponsibleUserId;
        entity.ValidFrom = request.ValidFrom;
        entity.ValidUntil = request.ValidUntil;
        entity.Currency = request.Currency;
        entity.DiscountPercentage = request.DiscountPercentage;
        entity.Subtotal = totals.Subtotal;
        entity.VatTotal = totals.Vat;
        entity.GrandTotal = totals.Grand;
        entity.Notes = request.Notes;
        entity.Status = request.Status;

        await _repository.UpdateAsync(entity, cancellationToken);

        await OfferSyncHelper.SyncItemsAsync(_db, entity.Id, request.Items, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        var detail = await OfferDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return OfferErrors.NotFound;
        return detail;
    }
}
