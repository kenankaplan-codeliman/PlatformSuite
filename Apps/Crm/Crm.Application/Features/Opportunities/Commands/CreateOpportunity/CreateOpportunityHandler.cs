using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Opportunities;
using Crm.Domain.Parameters;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityHandler : IRequestHandler<CreateOpportunityCommand, Result<OpportunityDetailItem>>
{
    private readonly IOpportunityRepository _repository;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;

    public CreateOpportunityHandler(
        IOpportunityRepository repository,
        ICrmDbContext db,
        IGeneralParameterReader parameters)
    {
        _repository = repository;
        _db = db;
        _parameters = parameters;
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

        var entity = request.Adapt<Opportunity>();
        await _repository.CreateAsync(entity, cancellationToken);

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
