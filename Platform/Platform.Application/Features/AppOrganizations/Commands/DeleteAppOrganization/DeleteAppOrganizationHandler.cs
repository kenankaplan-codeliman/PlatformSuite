using Platform.Application.Common.Results;
using Platform.Application.Interfaces;
using MediatR;

namespace Platform.Application.Features.AppOrganizations.Commands.DeleteAppOrganization;

public sealed class DeleteAppOrganizationHandler : IRequestHandler<DeleteAppOrganizationCommand, Result>
{
    private readonly IAuthOrganizationRepository _repository;

    public DeleteAppOrganizationHandler(IAuthOrganizationRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteAppOrganizationCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return AppOrganizationErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
