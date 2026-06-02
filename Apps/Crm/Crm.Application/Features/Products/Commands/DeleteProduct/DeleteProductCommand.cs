using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Products.Commands.DeleteProduct;

public sealed record DeleteProductCommand(List<Guid> Ids) : ICommand;
