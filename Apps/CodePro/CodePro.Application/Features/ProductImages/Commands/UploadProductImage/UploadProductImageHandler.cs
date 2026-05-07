using CodePro.Application.Features.ProductImages.Dtos;
using CodePro.Application.Interfaces;
using CodePro.Domain.Entities.Products;
using Platform.Application.Common.Results;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CodePro.Application.Features.ProductImages.Commands.UploadProductImage;

public sealed class UploadProductImageHandler
    : IRequestHandler<UploadProductImageCommand, Result<ProductImageItem>>
{
    private readonly IProductImageRepository _repository;
    private readonly IImageResizer _imageResizer;
    private readonly ICodeProDbContext _db;

    public UploadProductImageHandler(
        IProductImageRepository repository,
        IImageResizer imageResizer,
        ICodeProDbContext db)
    {
        _repository = repository;
        _imageResizer = imageResizer;
        _db = db;
    }

    public async Task<Result<ProductImageItem>> Handle(
        UploadProductImageCommand request,
        CancellationToken cancellationToken)
    {
        if (!request.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            return ProductImageErrors.InvalidContentType;

        var productExists = await _db.Product.AsNoTracking()
            .AnyAsync(p => p.Id == request.ProductId, cancellationToken);
        if (!productExists) return ProductImageErrors.ProductNotFound;

        byte[] thumbnailBytes;
        try
        {
            thumbnailBytes = _imageResizer.ResizeToThumbnail(request.DataBytes);
        }
        catch
        {
            return ProductImageErrors.InvalidImage;
        }

        var isFirst = !await _repository.HasAnyAsync(request.ProductId, cancellationToken);

        var image = new ProductImage
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            FileName = request.FileName,
            ContentType = request.ContentType,
            FileSize = request.FileSize,
            ImageBytes = request.DataBytes,
            ThumbnailBytes = thumbnailBytes,
            SortOrder = request.SortOrder,
            IsDefault = isFirst,
        };

        var saved = await _repository.CreateAsync(image, cancellationToken);
        return saved.Adapt<ProductImageItem>();
    }
}
