using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace Crm.Application.Features.Opportunities.Commands.DeleteOpportunity;

public sealed class DeleteOpportunityHandler : IRequestHandler<DeleteOpportunityCommand, Result>
{
    private readonly IOpportunityRepository _repository;

    public DeleteOpportunityHandler(IOpportunityRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteOpportunityCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return OpportunityErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
