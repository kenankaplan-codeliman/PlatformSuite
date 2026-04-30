using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Manufacturers.Commands.DeleteManufacturer;

public sealed record DeleteManufacturerCommand(Guid Id) : ICommand;
