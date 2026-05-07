using CodePro.Application.Interfaces;
using Platform.Application.Common.Results;
using MediatR;

namespace CodePro.Application.Features.ProductImages.Commands.ReorderProductImages;

public sealed class ReorderProductImagesHandler : IRequestHandler<ReorderProductImagesCommand, Result>
{
    private readonly IProductImageRepository _repository;

    public ReorderProductImagesHandler(IProductImageRepository repository)
        => _repository = repository;

    public async Task<Result> Handle(ReorderProductImagesCommand request, CancellationToken cancellationToken)
    {
        var images = await _repository.GetByProductAsync(request.ProductId, cancellationToken);

        // İstemci, ürünün tüm görsellerini içeren tam ve permütasyon olan bir ID listesi göndermelidir.
        if (images.Count != request.ImageIds.Count
            || images.Any(i => !request.ImageIds.Contains(i.Id)))
        {
            return ProductImageErrors.ReorderMismatch;
        }

        var orderMap = request.ImageIds
            .Select((id, idx) => (id, idx))
            .ToDictionary(p => p.id, p => p.idx);

        foreach (var image in images)
        {
            if (orderMap.TryGetValue(image.Id, out var newOrder))
                image.SortOrder = newOrder;
        }

        await _repository.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
