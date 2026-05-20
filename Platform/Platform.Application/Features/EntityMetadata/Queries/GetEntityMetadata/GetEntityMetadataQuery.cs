using Platform.Application.Common.Abstractions;
using MetadataDto = Platform.Application.Common.Metadata.EntityMetadata;

namespace Platform.Application.Features.EntityMetadata.Queries.GetEntityMetadata;

/// <summary>
/// Herhangi bir entity'nin ortak metadata'sını (audit / owner / state) tipten
/// bağımsız okur. <paramref name="EntityType"/> entity'nin CLR tip adıdır
/// (ör. "Account", "Supplier"); <paramref name="Id"/> kaydın Id'si.
/// </summary>
public sealed record GetEntityMetadataQuery(string EntityType, Guid Id) : IQuery<MetadataDto>;
