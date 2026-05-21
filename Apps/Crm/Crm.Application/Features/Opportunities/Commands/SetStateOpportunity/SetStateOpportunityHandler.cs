using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Opportunities.Commands.SetStateOpportunity;

public sealed class SetStateOpportunityHandler : IRequestHandler<SetStateOpportunityCommand, Result>
{
    private readonly IOpportunityRepository _repository;

    public SetStateOpportunityHandler(IOpportunityRepository repository) => _repository = repository;

    public async Task<Result> Handle(SetStateOpportunityCommand request, CancellationToken cancellationToken)
    {
        await _repository.SetStateAsync(request.Ids, request.IsActive, cancellationToken);
        return Result.Success();
    }
}
