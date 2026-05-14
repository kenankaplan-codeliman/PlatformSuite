using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Opportunities;
using Crm.Domain.Parameters;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityHandler : IRequestHandler<CreateOpportunityCommand, Result<OpportunityDetailItem>>
{
    private readonly IOpportunityRepository _repository;
    private readonly IGeneralParameterReader _parameters;

    public CreateOpportunityHandler(IOpportunityRepository repository, IGeneralParameterReader parameters)
    {
        _repository = repository;
        _parameters = parameters;
    }

    public async Task<Result<OpportunityDetailItem>> Handle(CreateOpportunityCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(OpportunityParameterCodes.Stage, request.Stage, cancellationToken))
            return OpportunityErrors.InvalidStage;

        var entity = request.Adapt<Opportunity>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<OpportunityDetailItem>();
    }
}
