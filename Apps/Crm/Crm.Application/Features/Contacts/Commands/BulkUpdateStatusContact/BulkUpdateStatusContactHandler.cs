using Platform.Application.Common.Parameters;
using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;
using Crm.Domain.Parameters;
using MediatR;

namespace Crm.Application.Features.Contacts.Commands.BulkUpdateStatusContact;

public sealed class BulkUpdateStatusContactHandler : IRequestHandler<BulkUpdateStatusContactCommand, Result>
{
    private readonly IContactRepository _repository;
    private readonly IGeneralParameterReader _parameters;

    public BulkUpdateStatusContactHandler(IContactRepository repository, IGeneralParameterReader parameters)
    {
        _repository = repository;
        _parameters = parameters;
    }

    public async Task<Result> Handle(BulkUpdateStatusContactCommand request, CancellationToken cancellationToken)
    {
        if (!await _parameters.ExistsAsync(ContactParameterCodes.Status, request.Status, cancellationToken))
            return ContactErrors.InvalidStatus;

        foreach (var id in request.Ids)
        {
            var entity = await _repository.GetAsync(id, cancellationToken);
            if (entity is null) return ContactErrors.NotFound;
            entity.ContactStatus = request.Status;
            await _repository.UpdateAsync(entity, cancellationToken);
        }
        return Result.Success();
    }
}
