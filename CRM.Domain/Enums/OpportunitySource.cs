namespace CRM.Domain.Enums;

/// <summary>Fırsatın kaynağı</summary>
public enum OpportunitySource
{
    /// <summary>Web sitesi / form</summary>
    Web,

    /// <summary>Referans</summary>
    Referral,

    /// <summary>Soğuk arama</summary>
    ColdCall,

    /// <summary>E-posta kampanyası</summary>
    EmailCampaign,

    /// <summary>Etkinlik / fuar</summary>
    Event,

    /// <summary>Sosyal medya</summary>
    SocialMedia,

    /// <summary>İş ortağı</summary>
    Partner,

    /// <summary>Mevcut müşteri (upsell / cross-sell)</summary>
    ExistingCustomer,

    Other,
}