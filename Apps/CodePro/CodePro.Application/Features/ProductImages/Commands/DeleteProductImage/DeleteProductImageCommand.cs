using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductImages.Commands.DeleteProductImage;

public sealed record DeleteProductImageCommand(Guid Id) : ICommand;
