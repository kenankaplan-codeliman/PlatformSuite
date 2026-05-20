using MediatR;
using Platform.Application.Common.Metadata;
using Platform.Application.Common.Results;
using MetadataDto = Platform.Application.Common.Metadata.EntityMetadata;

namespace Platform.Application.Features.EntityMetadata.Queries.GetEntityMetadata;

public sealed class GetEntityMetadataHandler : IRequestHandler<GetEntityMetadataQuery, Result<MetadataDto>>
{
    public static readonly Error NotFound =
        new("EntityMetadata.NotFound", "Kayıt bulunamadı.", ErrorType.NotFound);

    private readonly IEnumerable<IEntityMetadataResolver> _resolvers;

    public GetEntityMetadataHandler(IEnumerable<IEntityMetadataResolver> resolvers)
        => _resolvers = resolvers;

    public async Task<Result<MetadataDto>> Handle(GetEntityMetadataQuery request, CancellationToken cancellationToken)
    {
        // Host'taki resolver'lar sırayla denenir; entity tipini tanıyan ilk resolver çözer.
        foreach (var resolver in _resolvers)
        {
            var metadata = await resolver.TryResolveAsync(request.EntityType, request.Id, cancellationToken);
            if (metadata is not null) return metadata;
        }

        return NotFound;
    }
}
