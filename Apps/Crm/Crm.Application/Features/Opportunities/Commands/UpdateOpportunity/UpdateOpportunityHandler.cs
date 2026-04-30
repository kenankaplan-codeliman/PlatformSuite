using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;

public sealed class UpdateOpportunityHandler : IRequestHandler<UpdateOpportunityCommand, Result<OpportunityDetailItem>>
{
    private readonly IOpportunityRepository _repository;

    public UpdateOpportunityHandler(IOpportunityRepository repository) => _repository = repository;

    public async Task<Result<OpportunityDetailItem>> Handle(UpdateOpportunityCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return OpportunityErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<OpportunityDetailItem>();
    }
}
