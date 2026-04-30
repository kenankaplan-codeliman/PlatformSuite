using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
using Platform.Application.Common.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Interfaces;

/// <summary>
/// CRM uygulamasına özgü DbContext kontratı. Platform IApplicationDbContext'ine ek olarak
/// Lead ve Opportunity DbSet'lerini sunar. Query handler'lar Crm.Infrastructure tipi
/// (CrmDbContext) görmeden bu interface üzerinden EF query yazar.
/// </summary>
public interface ICrmDbContext : IApplicationDbContext
{
    DbSet<Lead> Lead { get; }
    DbSet<Opportunity> Opportunity { get; }
}
