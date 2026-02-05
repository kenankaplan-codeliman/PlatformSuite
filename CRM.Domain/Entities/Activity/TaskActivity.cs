using CRM.Domain.Enums;

namespace CRM.Domain.Entities.Activity;

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
    /// Görev tamamlandı mı?
    /// </summary>
    public bool IsCompleted { get; set; }

    /// <summary>
    /// Tamamlanma tarihi
    /// </summary>
    public virtual DateTime? TaskCompletedAt {
        get { 
            return base.CompletedDate;    
        }
        set {
            base.CompletedDate = value;   
        } 
    }

    /// <summary>
    /// Hatırlatıcı tarihi
    /// </summary>
    public DateTime? ReminderAt { get; set; }

    /// <summary>
    /// Hatırlatıcı aktif mi?
    /// </summary>
    public bool IsReminderSet { get; set; }

    /// <summary>
    /// Hatırlatıcı gönderildi mi?
    /// </summary>
    public bool IsReminderSent { get; set; }

    /// <summary>
    /// Tamamlanma yüzdesi (0-100)
    /// </summary>
    public int PercentComplete { get; set; } = 0;

    /// <summary>
    /// Başlangıç tarihi
    /// </summary>
    public DateTime? StartDate { get; set; }
    #endregion

    #region Domain Methods
    /// <summary>
    /// Görevi tamamla
    /// </summary>
    public void CompleteTask()
    {
        IsCompleted = true;
        TaskCompletedAt = DateTime.UtcNow;
        PercentComplete = 100;
        MarkAsCompleted();
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

    /// <summary>
    /// Hatırlatıcı ayarla
    /// </summary>
    public void SetReminder(DateTime reminderDate)
    {
        ReminderAt = reminderDate;
        IsReminderSet = true;
        IsReminderSent = false;
    }

    /// <summary>
    /// Hatırlatıcıyı kaldır
    /// </summary>
    public void ClearReminder()
    {
        ReminderAt = null;
        IsReminderSet = false;
    }

    /// <summary>
    /// Hatırlatıcı gönderildi olarak işaretle
    /// </summary>
    public void MarkReminderSent()
    {
        IsReminderSent = true;
    }

    /// <summary>
    /// Aktiviteyi tamamlandı olarak işaretle
    /// </summary>
    public override void MarkAsCompleted()
    {
        base.MarkAsCompleted();
        IsCompleted = true;
        TaskCompletedAt = CompletedDate;
        PercentComplete = 100;
    }
    #endregion
}