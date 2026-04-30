namespace Platform.Application.Mapping;

/// <summary>
/// Parent entity'nin child koleksiyonunu, DTO'dan gelen liste ile merge eder.
/// DTO'da olmayan kayıtlar silinir; DTO'da Id boş olan yeni kayıtlar eklenir; var olanlar güncellenir.
/// </summary>
public static class CollectionSync
{
    public static void Merge<TSrc, TDst>(
        IReadOnlyList<TSrc> source,
        ICollection<TDst> destination,
        Func<TSrc, Guid> srcId,
        Func<TDst, Guid> dstId,
        Func<TSrc, TDst> factory,
        Action<TSrc, TDst> update)
        where TDst : class
    {
        var sourceIds = source
            .Select(srcId)
            .Where(id => id != Guid.Empty)
            .ToHashSet();

        foreach (var existing in destination.ToList())
        {
            if (!sourceIds.Contains(dstId(existing)))
                destination.Remove(existing);
        }

        foreach (var src in source)
        {
            var id = srcId(src);
            var existing = id == Guid.Empty
                ? null
                : destination.FirstOrDefault(d => dstId(d) == id);

            if (existing is null)
                destination.Add(factory(src));
            else
                update(src, existing);
        }
    }
}
