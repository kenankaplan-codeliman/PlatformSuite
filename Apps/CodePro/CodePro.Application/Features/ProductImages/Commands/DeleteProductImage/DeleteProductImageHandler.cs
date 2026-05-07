using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.ProductImages.Commands.DeleteProductImage;

public sealed class DeleteProductImageHandler : IRequestHandler<DeleteProductImageCommand, Result>
{
    private readonly IProductImageRepository _repository;

    public DeleteProductImageHandler(IProductImageRepository repository)
        => _repository = repository;

    public async Task<Result> Handle(DeleteProductImageCommand request, CancellationToken cancellationToken)
    {
        var image = await _repository.GetAsync(request.Id, cancellationToken);
        if (image is null) return ProductImageErrors.NotFound;

        await _repository.DeleteAsync(image, cancellationToken);
        return Result.Success();
    }
}
