using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductCatalogs.Commands.DeleteProductCatalog;

public sealed record DeleteProductCatalogCommand(Guid Id) : ICommand;
