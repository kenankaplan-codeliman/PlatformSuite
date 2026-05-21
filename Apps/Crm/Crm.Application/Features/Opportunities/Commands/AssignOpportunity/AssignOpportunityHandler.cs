using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Opportunities.Commands.AssignOpportunity;

public sealed class AssignOpportunityHandler : IRequestHandler<AssignOpportunityCommand, Result>
{
    private readonly IOpportunityRepository _repository;

    public AssignOpportunityHandler(IOpportunityRepository repository) => _repository = repository;

    public async Task<Result> Handle(AssignOpportunityCommand request, CancellationToken cancellationToken)
    {
        await _repository.AssignAsync(request.Ids, request.OwnerId, cancellationToken);
        return Result.Success();
    }
}
