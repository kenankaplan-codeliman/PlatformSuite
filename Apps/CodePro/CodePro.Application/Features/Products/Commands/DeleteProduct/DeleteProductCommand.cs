using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Products.Commands.DeleteProduct;

public sealed record DeleteProductCommand(Guid Id) : ICommand;
