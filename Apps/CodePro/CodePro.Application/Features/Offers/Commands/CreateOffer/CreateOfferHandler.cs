using CodePro.Application.Features.Offers.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Constants;
using CodePro.Domain.Entities.Offers;
using CodePro.Domain.Enums;
using Platform.Application.Common.Numbering;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.Offers.Commands.CreateOffer;

public sealed class CreateOfferHandler : IRequestHandler<CreateOfferCommand, Result<OfferDetailItem>>
{
    private readonly IOfferRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICodeProDbContext _db;
    private readonly INumberGeneratorService _numberGenerator;

    public CreateOfferHandler(
        IOfferRepository repository,
        IAttachmentRepository attachmentRepository,
        ICodeProDbContext db,
        INumberGeneratorService numberGenerator)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
        _numberGenerator = numberGenerator;
    }

    public async Task<Result<OfferDetailItem>> Handle(CreateOfferCommand request, CancellationToken cancellationToken)
    {
        var offerNumber = string.IsNullOrWhiteSpace(request.OfferNumber)
            ? await _numberGenerator.GenerateAsync(CodeProDocumentTypes.Offer, ct: cancellationToken)
            : request.OfferNumber.Trim();

        var numberExists = await _db.Offer.AsNoTracking()
            .AnyAsync(o => o.OfferNumber.ToLower() == offerNumber.ToLower(), cancellationToken);
        if (numberExists) return OfferErrors.DuplicateOfferNumber;

        var totals = OfferSyncHelper.CalculateTotals(request.Items, request.DiscountPercentage);

        var entity = new Offer
        {
            OfferNumber = offerNumber,
            OfferType = request.OfferType,
            Subject = request.Subject,
            CounterpartyName = request.CounterpartyName,
            CounterpartyId = request.CounterpartyId,
            ResponsibleUserId = request.ResponsibleUserId,
            ValidFrom = request.ValidFrom,
            ValidUntil = request.ValidUntil,
            Currency = request.Currency,
            DiscountPercentage = request.DiscountPercentage,
            Subtotal = totals.Subtotal,
            VatTotal = totals.Vat,
            GrandTotal = totals.Grand,
            Notes = request.Notes,
            Status = OfferStatus.Draft,
        };
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Items.Count > 0)
        {
            await OfferSyncHelper.SyncItemsAsync(_db, entity.Id, request.Items, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
        }

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Offer), cancellationToken);
        }

        var detail = await OfferDetailBuilder.BuildAsync(_db, entity.Id, cancellationToken);
        if (detail is null) return OfferErrors.NotFound;
        return detail;
    }
}
