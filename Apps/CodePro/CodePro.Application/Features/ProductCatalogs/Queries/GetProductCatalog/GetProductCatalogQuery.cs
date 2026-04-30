using CodePro.Application.Features.ProductCatalogs.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.ProductCatalogs.Queries.GetProductCatalog;

public sealed record GetProductCatalogQuery(Guid Id) : IQuery<ProductCatalogDetailItem>;
