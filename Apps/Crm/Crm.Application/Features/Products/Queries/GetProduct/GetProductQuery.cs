using Platform.Application.Common.Abstractions;
using Crm.Application.Features.Products.Dtos;

namespace Crm.Application.Features.Products.Queries.GetProduct;

public sealed record GetProductQuery(Guid Id) : IQuery<ProductDetailItem>;
