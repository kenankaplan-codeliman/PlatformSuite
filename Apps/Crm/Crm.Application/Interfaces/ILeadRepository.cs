using Crm.Domain.Entities.Leads;
using Platform.Application.Interfaces;
using Crm.Application.Interfaces;

namespace Crm.Application.Interfaces;

public interface ILeadRepository : IEntityRepository<Lead>
{
}
