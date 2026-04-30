using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Manufacturers;

public static class ManufacturerErrors
{
    public static readonly Error NotFound =
        new("Manufacturer.NotFound", "Üretici bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateName =
        new("Manufacturer.DuplicateName", "Aynı isimde başka bir üretici kayıtlı.", ErrorType.Conflict);
}
