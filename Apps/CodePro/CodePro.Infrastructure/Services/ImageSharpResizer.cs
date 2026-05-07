using CodePro.Application.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace CodePro.Infrastructure.Services;

public sealed class ImageSharpResizer : IImageResizer
{
    public byte[] ResizeToThumbnail(byte[] originalBytes, int maxDimension = 800, int quality = 80)
    {
        using var input = new MemoryStream(originalBytes);
        using var image = Image.Load(input);

        if (image.Width > maxDimension || image.Height > maxDimension)
        {
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(maxDimension, maxDimension),
            }));
        }

        using var output = new MemoryStream();
        image.Save(output, new JpegEncoder { Quality = quality });
        return output.ToArray();
    }
}
