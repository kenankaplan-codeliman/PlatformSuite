namespace Crm.Application.Features.Dashboard.Dtos;

/// <summary>Dashboard "ilgilenilmesi gereken lead'ler" widget'ı için hafif lead özeti.</summary>
public class LeadDigestItem
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = default!;
    public string? FullName { get; set; }
    public string? Company { get; set; }
    public string? Rating { get; set; }
    public string Status { get; set; } = default!;
    public int? Score { get; set; }
    public decimal? EstimatedValue { get; set; }
    public DateTime CreatedAt { get; set; }
}
