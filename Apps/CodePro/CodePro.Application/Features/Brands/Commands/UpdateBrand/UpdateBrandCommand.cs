using CodePro.Application.Features.Brands.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Brands.Commands.UpdateBrand;

public sealed class UpdateBrandCommand : ICommand<BrandDetailItem>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
}
