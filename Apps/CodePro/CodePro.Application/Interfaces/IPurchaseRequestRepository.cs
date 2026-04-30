using CodePro.Domain.Entities.PurchaseRequests;
using Platform.Application.Interfaces;

namespace CodePro.Application.Interfaces;

public interface IPurchaseRequestRepository : IEntityRepository<PurchaseRequest>
{
}
