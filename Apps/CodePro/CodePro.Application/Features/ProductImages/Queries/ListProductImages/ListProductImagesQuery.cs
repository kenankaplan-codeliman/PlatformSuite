using CodePro.Application.Features.ProductImages.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductImages.Queries.ListProductImages;

public sealed record ListProductImagesQuery(Guid Id) : IQuery<List<ProductImageItem>>;
