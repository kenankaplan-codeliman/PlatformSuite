using System.Text.Json.Serialization;

namespace Platform.Domain.Enums;

/// <summary>
/// Attachment dosyalarının belge türü. Platform-seviyesi enum;
/// uygulamalar (CRM, CodePro) ortak değerler üzerinden ek dosyaları sınıflandırır.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum DocumentType
{
    Other,

    // Kimlik & Vergi
    TicaretSicilGazetesi,
    VergiLevhasi,
    ImzaSirkuleri,
    FaaliyetBelgesi,
    KapasiteRaporu,

    // Şirket Kuruluş & Tescil
    AnaSozlesme,
    KurulusKarari,
    TicaretSicilBelgesi,
    MersisBelgesi,

    // Finans & Mali
    MaliTablo,
    BilancoBelgesi,
    KrediDerecelendirme,
    BankaReferansBelgesi,

    // Kalite & Sertifika
    IsoSertifikasi,
    UrununUygunlukBelgesi,
    AkreditasyonBelgesi,

    // Sözleşme & Teklif
    Sozlesme,
    Teklif,
    Siparis,
    Fatura,
    Irsaliye,
    Sartname,
    TeknikDokuman,

    // Diğer Resmi Belgeler
    VekaletName,
    YetkiYazisi,
    ReferansMektubu,
    IflasSorgulama,
}
