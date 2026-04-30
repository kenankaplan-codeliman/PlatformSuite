using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Brands;

public static class BrandErrors
{
    public static readonly Error NotFound =
        new("Brand.NotFound", "Marka bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateName =
        new("Brand.DuplicateName", "Aynı isimde başka bir marka kayıtlı.", ErrorType.Conflict);
}
