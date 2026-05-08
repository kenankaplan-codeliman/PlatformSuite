using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Suppliers;

public static class SupplierErrors
{
    public static readonly Error NotFound =
        new("Supplier.NotFound", "Tedarikçi bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateVkn =
        new("Supplier.DuplicateVkn", "Bu vergi numarasıyla kayıtlı bir tedarikçi zaten mevcut.", ErrorType.Conflict);
}
