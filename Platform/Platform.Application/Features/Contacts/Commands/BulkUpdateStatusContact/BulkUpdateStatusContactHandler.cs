using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.Contacts.Commands.BulkUpdateStatusContact;

public sealed class BulkUpdateStatusContactHandler : IRequestHandler<BulkUpdateStatusContactCommand, Result>
{
    private readonly IContactRepository _repository;

    public BulkUpdateStatusContactHandler(IContactRepository repository) => _repository = repository;

    public async Task<Result> Handle(BulkUpdateStatusContactCommand request, CancellationToken cancellationToken)
    {
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
