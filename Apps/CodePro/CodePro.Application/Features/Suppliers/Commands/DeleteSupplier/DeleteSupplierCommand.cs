using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Suppliers.Commands.DeleteSupplier;

public sealed record DeleteSupplierCommand(Guid Id) : ICommand;
