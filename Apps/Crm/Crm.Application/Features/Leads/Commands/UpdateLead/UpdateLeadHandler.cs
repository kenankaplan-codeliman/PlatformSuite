using Crm.Application.Common.Communications;
using Crm.Application.Features.Leads;
using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Parameters;
using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;

namespace Crm.Application.Features.Leads.Commands.UpdateLead;

public sealed class UpdateLeadHandler : IRequestHandler<UpdateLeadCommand, Result<LeadDetailItem>>
{
    private readonly ILeadRepository _repository;
    private readonly ICommunicationRepository _communications;
    private readonly ICrmDbContext _db;
    private readonly IGeneralParameterReader _parameters;

    public UpdateLeadHandler(
        ILeadRepository repository,
        ICommunicationRepository communications,
        ICrmDbContext db,
        IGeneralParameterReader parameters)
    {
        _repository = repository;
        _communications = communications;
        _db = db;
        _parameters = parameters;
    }

    public async Task<Result<LeadDetailItem>> Handle(UpdateLeadCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return LeadErrors.NotFound;

        if (!await _parameters.ExistsAsync(LeadParameterCodes.Status, request.Status, cancellationToken))
            return LeadErrors.InvalidStatus;

        if (!await _parameters.ExistsAsync(LeadParameterCodes.Source, request.Source, cancellationToken))
            return LeadErrors.InvalidSource;

        if (!string.IsNullOrEmpty(request.Rating) &&
            !await _parameters.ExistsAsync(LeadParameterCodes.Rating, request.Rating, cancellationToken))
            return LeadErrors.InvalidRating;

        if (!string.IsNullOrEmpty(request.EstimatedValueCurrency) &&
            !await _parameters.ExistsAsync(CurrencyParameterCodes.CurrencyType, request.EstimatedValueCurrency, cancellationToken))
            return LeadErrors.InvalidCurrency;

        request.Adapt(entity);
        await _repository.UpdateAsync(entity, cancellationToken);

        await _communications.SyncAsync(
            nameof(Lead), entity.Id, request.Emails, request.Phones, request.Addresses, cancellationToken);

        return await _db.BuildLeadDetailAsync(entity.Id, cancellationToken);
    }
}
