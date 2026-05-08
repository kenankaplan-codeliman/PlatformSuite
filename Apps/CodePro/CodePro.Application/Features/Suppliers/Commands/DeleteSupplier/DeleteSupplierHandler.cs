using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Suppliers.Commands.DeleteSupplier;

public sealed class DeleteSupplierHandler : IRequestHandler<DeleteSupplierCommand, Result>
{
    private readonly ISupplierRepository _repository;

    public DeleteSupplierHandler(ISupplierRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteSupplierCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return SupplierErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
