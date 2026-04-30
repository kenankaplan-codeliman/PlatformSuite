using Platform.Domain.Enums;

namespace Platform.Domain.Entities.Activities;

/// <summary>
/// Görev Aktivitesi
/// </summary>
public class TaskActivity : ActivityBase
{
    public TaskActivity() : base(ActivityType.Task)
    {
    }


    #region Task Properties
    /// <summary>
    /// Görev açıklaması (Detaylı)
    /// </summary>
    public string? TaskDescription { get; set; }
   
    /// <summary>
    /// Hatırlatıcı tarihi
    /// </summary>
    public DateTime? ReminderAt { get; set; }

    /// <summary>
    /// Tamamlanma yüzdesi (0-100)
    /// </summary>
    public int PercentComplete { get; set; } = 0;

   
    #endregion

    #region Domain Methods
    /// <summary>
    /// Görevi tamamla
    /// </summary>
    public void CompleteTask()
    {
        EndDate= DateTime.UtcNow;
        PercentComplete = 100;
        Completed();
    }

    /// <summary>
    /// İlerleme durumunu güncelle
    /// </summary>
    public void UpdateProgress(int percent)
    {
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;

        PercentComplete = percent;

        if (percent == 100)
        {
            CompleteTask();
        }
        else if (percent > 0)
        {
            Status = ActivityStatus.InProgress;
        }
    }
   
    #endregion
}