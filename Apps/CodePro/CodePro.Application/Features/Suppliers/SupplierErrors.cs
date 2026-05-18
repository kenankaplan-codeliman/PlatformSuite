using Platform.Application.Common.Results;

namespace CodePro.Application.Features.Suppliers;

public static class SupplierErrors
{
    public static readonly Error NotFound =
        new("Supplier.NotFound", "Tedarikçi bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateVkn =
        new("Supplier.DuplicateVkn", "Bu vergi numarasıyla kayıtlı bir tedarikçi zaten mevcut.", ErrorType.Conflict);

    public static readonly Error InvalidType =
        new("Supplier.InvalidType", "Geçersiz tedarikçi tipi.", ErrorType.Validation);

    public static readonly Error InvalidStatus =
        new("Supplier.InvalidStatus", "Geçersiz tedarikçi durumu.", ErrorType.Validation);

    public static readonly Error InvalidCompanyType =
        new("Supplier.InvalidCompanyType", "Geçersiz şirket türü.", ErrorType.Validation);

    public static readonly Error InvalidCompanyLegalType =
        new("Supplier.InvalidCompanyLegalType", "Geçersiz şirket hukuki türü.", ErrorType.Validation);
}
