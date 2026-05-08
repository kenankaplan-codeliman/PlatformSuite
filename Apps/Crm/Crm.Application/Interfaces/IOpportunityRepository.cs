using Crm.Domain.Entities.Opportunities;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;

namespace Crm.Application.Interfaces;

public interface IOpportunityRepository : IEntityRepository<Opportunity>
{
}
