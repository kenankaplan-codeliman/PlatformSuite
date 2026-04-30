using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Leads;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.CreateLead;

public sealed class CreateLeadHandler : IRequestHandler<CreateLeadCommand, Result<LeadDetailItem>>
{
    private readonly ILeadRepository _repository;

    public CreateLeadHandler(ILeadRepository repository) => _repository = repository;

    public async Task<Result<LeadDetailItem>> Handle(CreateLeadCommand request, CancellationToken cancellationToken)
    {
        var entity = request.Adapt<Lead>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<LeadDetailItem>();
    }
}
