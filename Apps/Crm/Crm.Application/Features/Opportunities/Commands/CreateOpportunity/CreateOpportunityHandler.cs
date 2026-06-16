using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Constants;
using Crm.Domain.Entities.Opportunities;
using Crm.Domain.Parameters;
using Platform.Application.Common.Numbering;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityHandler : IRequestHandler<CreateOpportunityCommand, Result<OpportunityDetailItem>>
{
    private readonly IOpportunityRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;
    private readonly INumberGeneratorService _numberGenerator;

    public CreateOpportunityHandler(
        IOpportunityRepository repository,
        IAttachmentRepository attachmentRepository,
        ICrmDbContext db,
        IGeneralParameterReader parameters,
        INumberGeneratorService numberGenerator)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
        _parameters = parameters;
        _numberGenerator = numberGenerator;
    }

    public async Task<Result<OpportunityDetailItem>> Handle(CreateOpportunityCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(OpportunityParameterCodes.Stage, request.Stage, cancellationToken))
            return OpportunityErrors.InvalidStage;

        if (!string.IsNullOrEmpty(request.Currency) &&
            !await _parameters.ExistsAsync(CurrencyParameterCodes.CurrencyType, request.Currency, cancellationToken))
            return OpportunityErrors.InvalidCurrency;

        var lineCheck = await ValidateProductLinesAsync(request.Products, cancellationToken);
        if (lineCheck is not null) return lineCheck;

        // Fırsat Kodu numarator ile üretilir (FRS-{yıl}-{sıra}); kullanıcı girmez.
        // Üretim iş transaction'ı içinde (TransactionBehavior) — rollback'te sayaç geri gelir.
        var code = await _numberGenerator.GenerateAsync(CrmDocumentTypes.Opportunity, ct: cancellationToken);
        var codeExists = await _db.Opportunity.AsNoTracking()
            .AnyAsync(o => o.OpportunityCode.ToLower() == code.ToLower(), cancellationToken);
        if (codeExists) return OpportunityErrors.DuplicateOpportunityCode;

        var entity = request.Adapt<Opportunity>();
        entity.OpportunityCode = code;
        await _repository.CreateAsync(entity, cancellationToken);

        if (request.Attachments.Count > 0)
        {
            var metadataIds = request.Attachments.Select(a => a.MetadataId).ToList();
            await _attachmentRepository.AssociateAsync(metadataIds, entity.Id, nameof(Opportunity), cancellationToken);
        }

        return await BuildDetailAsync(entity.Id, cancellationToken);
    }

    private async Task<Error?> ValidateProductLinesAsync(
        IReadOnlyList<OpportunityProductModal> products, CancellationToken cancellationToken)
    {
        foreach (var line in products)
        {
            var productId = line.Product?.Id ?? Guid.Empty;
            if (!await _db.Product.AnyAsync(p => p.Id == productId && !p.IsDeleted, cancellationToken))
                return OpportunityErrors.ProductNotFound;
        }

        return null;
    }

    private async Task<OpportunityDetailItem> BuildDetailAsync(Guid id, CancellationToken cancellationToken)
    {
        var saved = await _db.Opportunity
            .AsNoTracking()
            .WithDetailIncludes()
            .FirstAsync(o => o.Id == id, cancellationToken);
        return saved.Adapt<OpportunityDetailItem>();
    }
}
