using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Manufacturers.Commands.DeleteManufacturer;

public sealed class DeleteManufacturerHandler : IRequestHandler<DeleteManufacturerCommand, Result>
{
    private readonly IManufacturerRepository _repository;

    public DeleteManufacturerHandler(IManufacturerRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteManufacturerCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return ManufacturerErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
