using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.AssignLead;

public sealed class AssignLeadHandler : IRequestHandler<AssignLeadCommand, Result>
{
    private readonly ILeadRepository _repository;

    public AssignLeadHandler(ILeadRepository repository) => _repository = repository;

    public async Task<Result> Handle(AssignLeadCommand request, CancellationToken cancellationToken)
    {
        await _repository.AssignAsync(request.Ids, request.OwnerId, cancellationToken);
        return Result.Success();
    }
}
