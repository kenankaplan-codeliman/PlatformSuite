using Platform.Application.Common.Results;

namespace CodePro.Application.Features.PurchaseOrders;

public static class PurchaseOrderErrors
{
    public static readonly Error NotFound =
        new("PurchaseOrder.NotFound", "Sipariş bulunamadı.", ErrorType.NotFound);

    public static readonly Error DuplicateOrderNumber =
        new("PurchaseOrder.DuplicateOrderNumber", "Aynı numarada başka bir sipariş kayıtlı.", ErrorType.Conflict);

    public static readonly Error SupplierNotFound =
        new("PurchaseOrder.SupplierNotFound", "Tedarikçi bulunamadı.", ErrorType.Validation);
}
