using CodePro.Application.Features.ProductImages.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductImages.Commands.UploadProductImage;

public sealed class UploadProductImageCommand : ICommand<ProductImageItem>
{
    public Guid ProductId { get; init; }
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public byte[] DataBytes { get; init; } = Array.Empty<byte>();
    public int SortOrder { get; init; }
}
