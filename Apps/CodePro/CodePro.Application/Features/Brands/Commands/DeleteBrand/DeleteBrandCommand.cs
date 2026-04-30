using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Brands.Commands.DeleteBrand;

public sealed record DeleteBrandCommand(Guid Id) : ICommand;
