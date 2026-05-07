using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.ProductImages.Commands.SetDefaultProductImage;

public sealed class SetDefaultProductImageHandler : IRequestHandler<SetDefaultProductImageCommand, Result>
{
    private readonly IProductImageRepository _repository;

    public SetDefaultProductImageHandler(IProductImageRepository repository)
        => _repository = repository;

    public async Task<Result> Handle(SetDefaultProductImageCommand request, CancellationToken cancellationToken)
    {
        var images = await _repository.GetByProductAsync(request.ProductId, cancellationToken);
        var target = images.FirstOrDefault(i => i.Id == request.ImageId);
        if (target is null) return ProductImageErrors.NotFound;

        if (target.IsDefault && images.Count(i => i.IsDefault) == 1)
            return Result.Success();

        foreach (var image in images)
            image.IsDefault = image.Id == request.ImageId;

        await _repository.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
