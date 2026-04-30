using Crm.Application.Features.Opportunities.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Opportunities;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Opportunities.Commands.CreateOpportunity;

public sealed class CreateOpportunityHandler : IRequestHandler<CreateOpportunityCommand, Result<OpportunityDetailItem>>
{
    private readonly IOpportunityRepository _repository;

    public CreateOpportunityHandler(IOpportunityRepository repository) => _repository = repository;

    public async Task<Result<OpportunityDetailItem>> Handle(CreateOpportunityCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Adapt<Opportunity>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<OpportunityDetailItem>();
    }
}
