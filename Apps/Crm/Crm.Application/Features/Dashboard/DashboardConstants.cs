namespace Crm.Application.Features.Dashboard;

/// <summary>
/// Dashboard widget query'lerinin paylaştığı sabitler. Stage code'ları
/// GeneralParameter (OpportunityStage) seed'i ile birebir aynıdır.
/// </summary>
public static class DashboardConstants
{
    public const string StageClosedWon = "ClosedWon";
    public const string StageClosedLost = "ClosedLost";

    /// <summary>Pipeline dışı (kapanmış) aşamalar — açık fırsat sorgularında hariç tutulur.</summary>
    public static readonly string[] ClosedStages = { StageClosedWon, StageClosedLost };

    /// <summary>Liste widget'larının varsayılan sayfa boyutu (ilk 3, sonra "daha fazla göster" 3'er ekler).</summary>
    public const int WidgetPageSize = 3;
}
