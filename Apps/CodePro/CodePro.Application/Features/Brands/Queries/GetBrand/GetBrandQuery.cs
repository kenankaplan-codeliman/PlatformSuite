using CodePro.Application.Features.Brands.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Brands.Queries.GetBrand;

public sealed record GetBrandQuery(Guid Id) : IQuery<BrandDetailItem>;
