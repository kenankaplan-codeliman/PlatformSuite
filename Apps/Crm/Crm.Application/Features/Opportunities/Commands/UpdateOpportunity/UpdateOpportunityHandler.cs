using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Opportunities;
using Crm.Domain.Parameters;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;

public sealed class UpdateOpportunityHandler : IRequestHandler<UpdateOpportunityCommand, Result<OpportunityDetailItem>>
{
    private readonly IOpportunityRepository _repository;
    private readonly IAttachmentRepository _attachmentRepository;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;

    public UpdateOpportunityHandler(
        IOpportunityRepository repository,
        IAttachmentRepository attachmentRepository,
        ICrmDbContext db,
        IGeneralParameterReader parameters)
    {
        _repository = repository;
        _attachmentRepository = attachmentRepository;
        _db = db;
        _parameters = parameters;
    }

    public async Task<Result<OpportunityDetailItem>> Handle(UpdateOpportunityCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return OpportunityErrors.NotFound;

        if (!await _parameters.ExistsAsync(OpportunityParameterCodes.Stage, request.Stage, cancellationToken))
            return OpportunityErrors.InvalidStage;

        if (!string.IsNullOrEmpty(request.Currency) &&
            !await _parameters.ExistsAsync(CurrencyParameterCodes.CurrencyType, request.Currency, cancellationToken))
            return OpportunityErrors.InvalidCurrency;

        var lineCheck = await ValidateProductLinesAsync(request.Products, cancellationToken);
        if (lineCheck is not null) return lineCheck;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

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
