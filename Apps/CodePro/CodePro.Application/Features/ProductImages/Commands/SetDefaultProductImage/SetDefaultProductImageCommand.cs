using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductImages.Commands.SetDefaultProductImage;

public sealed class SetDefaultProductImageCommand : ICommand
{
    public Guid ProductId { get; init; }
    public Guid ImageId { get; init; }
}
