using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductPrices.Commands.DeleteProductPrice;

public sealed record DeleteProductPriceCommand(Guid Id) : ICommand;
