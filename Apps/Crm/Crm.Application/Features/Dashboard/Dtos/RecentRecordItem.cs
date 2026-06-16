namespace Crm.Application.Features.Dashboard.Dtos;

/// <summary>Son eklenen kayıt özeti (Account/Contact birleşik akışı).</summary>
public class RecentRecordItem
{
    public Guid Id { get; set; }

    /// <summary>"Account" | "Contact" — frontend ikon/navigasyon için kullanır.</summary>
    public string EntityType { get; set; } = default!;
    public string Name { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
