using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.DeleteLead;

public sealed class DeleteLeadHandler : IRequestHandler<DeleteLeadCommand, Result>
{
    private readonly ILeadRepository _repository;

    public DeleteLeadHandler(ILeadRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteLeadCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return LeadErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
