using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Parameters;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;

public sealed class UpdateOpportunityHandler : IRequestHandler<UpdateOpportunityCommand, Result<OpportunityDetailItem>>
{
    private readonly IOpportunityRepository _repository;
    private readonly IGeneralParameterReader _parameters;

    public UpdateOpportunityHandler(IOpportunityRepository repository, IGeneralParameterReader parameters)
    {
        _repository = repository;
        _parameters = parameters;
    }

    public async Task<Result<OpportunityDetailItem>> Handle(UpdateOpportunityCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return OpportunityErrors.NotFound;

        if (!await _parameters.ExistsAsync(OpportunityParameterCodes.Stage, request.Stage, cancellationToken))
            return OpportunityErrors.InvalidStage;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<OpportunityDetailItem>();
    }
}
