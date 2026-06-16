namespace Crm.Application.Features.Dashboard.Dtos;

/// <summary>Dashboard görev/aktivite widget'ları için hafif aktivite özeti.
/// Enum alanlar string'e map'lenir (DashboardMappings).</summary>
public class ActivityDigestItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public string ActivityType { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string Priority { get; set; } = default!;
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public string? RegardingEntityType { get; set; }
    public Guid? RegardingEntityId { get; set; }
    public DateTime CreatedAt { get; set; }
}
