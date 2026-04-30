using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.UpdateLead;

public sealed class UpdateLeadHandler : IRequestHandler<UpdateLeadCommand, Result<LeadDetailItem>>
{
    private readonly ILeadRepository _repository;

    public UpdateLeadHandler(ILeadRepository repository) => _repository = repository;

    public async Task<Result<LeadDetailItem>> Handle(UpdateLeadCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return LeadErrors.NotFound;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);
        return entity.Adapt<LeadDetailItem>();
    }
}
