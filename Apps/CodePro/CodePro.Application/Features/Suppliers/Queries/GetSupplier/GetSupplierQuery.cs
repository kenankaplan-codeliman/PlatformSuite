using CodePro.Application.Features.Suppliers.Dtos;
using Platform.Application.Common.Abstractions;

namespace CodePro.Application.Features.Suppliers.Queries.GetSupplier;

public sealed record GetSupplierQuery(Guid Id) : IQuery<SupplierDetailItem>;
