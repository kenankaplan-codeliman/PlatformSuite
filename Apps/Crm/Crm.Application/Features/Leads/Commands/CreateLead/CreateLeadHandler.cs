using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Parameters;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.CreateLead;

public sealed class CreateLeadHandler : IRequestHandler<CreateLeadCommand, Result<LeadDetailItem>>
{
    private readonly ILeadRepository _repository;
    private readonly IGeneralParameterReader _parameters;

    public CreateLeadHandler(ILeadRepository repository, IGeneralParameterReader parameters)
    {
        _repository = repository;
        _parameters = parameters;
    }

    public async Task<Result<LeadDetailItem>> Handle(CreateLeadCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(LeadParameterCodes.Status, request.Status, cancellationToken))
            return LeadErrors.InvalidStatus;

        if (!await _parameters.ExistsAsync(LeadParameterCodes.Source, request.Source, cancellationToken))
            return LeadErrors.InvalidSource;

        if (!string.IsNullOrEmpty(request.EstimatedValueCurrency) &&
            !await _parameters.ExistsAsync(CurrencyParameterCodes.CurrencyType, request.EstimatedValueCurrency, cancellationToken))
            return LeadErrors.InvalidCurrency;

        var entity = request.Adapt<Lead>();
        await _repository.CreateAsync(entity, cancellationToken);
        return entity.Adapt<LeadDetailItem>();
    }
}
