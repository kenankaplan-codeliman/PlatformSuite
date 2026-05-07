using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductImages.Commands.ReorderProductImages;

public sealed class ReorderProductImagesCommand : ICommand
{
    public Guid ProductId { get; init; }
    public List<Guid> ImageIds { get; init; } = new();
}
