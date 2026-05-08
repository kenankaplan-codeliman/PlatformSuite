using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Contacts;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
using Platform.Application.Common.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Interfaces;

/// <summary>
/// CRM uygulamasına özgü DbContext kontratı. Platform IApplicationDbContext'ine ek olarak
/// Account, Contact, Lead ve Opportunity DbSet'lerini sunar. Query handler'lar Crm.Infrastructure tipi
/// (CrmDbContext) görmeden bu interface üzerinden EF query yazar.
/// </summary>
public interface ICrmDbContext : IApplicationDbContext
{
    // Account
    DbSet<Account> Account { get; }
    DbSet<AccountEmail> AccountEmail { get; }
    DbSet<AccountPhone> AccountPhone { get; }
    DbSet<AccountAddress> AccountAddress { get; }
    DbSet<AccountContact> AccountContact { get; }

    // Contact
    DbSet<Contact> Contact { get; }
    DbSet<ContactEmail> ContactEmail { get; }
    DbSet<ContactPhone> ContactPhone { get; }
    DbSet<ContactAddress> ContactAddress { get; }

    // CRM features
    DbSet<Lead> Lead { get; }
    DbSet<Opportunity> Opportunity { get; }
}
