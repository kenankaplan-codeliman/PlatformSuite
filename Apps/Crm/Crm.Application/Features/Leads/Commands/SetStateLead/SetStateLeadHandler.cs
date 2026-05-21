using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.SetStateLead;

public sealed class SetStateLeadHandler : IRequestHandler<SetStateLeadCommand, Result>
{
    private readonly ILeadRepository _repository;

    public SetStateLeadHandler(ILeadRepository repository) => _repository = repository;

    public async Task<Result> Handle(SetStateLeadCommand request, CancellationToken cancellationToken)
    {
        await _repository.SetStateAsync(request.Ids, request.IsActive, cancellationToken);
        return Result.Success();
    }
}
