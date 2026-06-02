using Platform.Application.Common.Abstractions;

namespace Crm.Application.Features.Products.Commands.SetStateProduct;

public sealed record SetStateProductCommand(List<Guid> Ids, bool IsActive) : ICommand;
