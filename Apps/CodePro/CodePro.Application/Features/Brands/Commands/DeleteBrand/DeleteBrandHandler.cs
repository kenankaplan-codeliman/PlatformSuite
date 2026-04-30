using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.Brands.Commands.DeleteBrand;

public sealed class DeleteBrandHandler : IRequestHandler<DeleteBrandCommand, Result>
{
    private readonly IBrandRepository _repository;

    public DeleteBrandHandler(IBrandRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteBrandCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id, cancellationToken);
        if (entity is null) return BrandErrors.NotFound;

        await _repository.DeleteAsync(entity, cancellationToken);
        return Result.Success();
    }
}
