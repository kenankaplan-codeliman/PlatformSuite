using Mapster;
using Platform.Domain.Entities.Common;

namespace Platform.Application.Mapping;

public static class MappingExtensions
{
    private static readonly string[] BaseAndAuditFields =
    {
        nameof(IBaseEntity.Id),
        nameof(IAuditableEntity.CreatedBy),
        nameof(IAuditableEntity.CreatedAt),
        nameof(IAuditableEntity.UpdatedBy),
        nameof(IAuditableEntity.UpdatedAt),
    };

    private static readonly string[] SoftDeleteFields =
    {
        nameof(ISoftDeleteEntity.IsDeleted),
        nameof(ISoftDeleteEntity.DeletedBy),
        nameof(ISoftDeleteEntity.DeletedAt),
    };

    /// <summary>
    /// DTO/Command → Entity mapping'lerinde Id + audit alanlarını ignore eder.
    /// Hedef tip <see cref="ISoftDeleteEntity"/> implement ediyorsa soft-delete alanlarını da dahil eder.
    /// </summary>
    public static TypeAdapterSetter<TSource, TDestination> IgnoreAuditFields<TSource, TDestination>(
        this TypeAdapterSetter<TSource, TDestination> setter)
    {
        var fields = typeof(ISoftDeleteEntity).IsAssignableFrom(typeof(TDestination))
            ? BaseAndAuditFields.Concat(SoftDeleteFields).ToArray()
            : BaseAndAuditFields;
        return setter.Ignore(fields);
    }
}
