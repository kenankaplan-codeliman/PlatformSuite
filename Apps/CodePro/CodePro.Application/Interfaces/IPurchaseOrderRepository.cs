using CodePro.Domain.Entities.PurchaseOrders;
using Platform.Application.Interfaces;

namespace CodePro.Application.Interfaces;

public interface IPurchaseOrderRepository : IEntityRepository<PurchaseOrder>
{
}
