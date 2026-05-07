namespace CodePro.Application.Interfaces;

/// <summary>
/// Görselleri thumbnail boyutuna küçültmek için soyutlama. Implementasyon
/// CodePro.Infrastructure içindedir.
/// </summary>
public interface IImageResizer
{
    byte[] ResizeToThumbnail(byte[] originalBytes, int maxDimension = 800, int quality = 80);
}
