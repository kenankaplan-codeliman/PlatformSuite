using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Communications;
using Crm.Domain.Entities.Contacts;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
using Crm.Domain.Entities.Products;
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
    DbSet<AccountContact> AccountContact { get; }

    // Contact
    DbSet<Contact> Contact { get; }

    // Communications (polimorfik owner — Account/Contact/... ortak)
    DbSet<EmailAddress> EmailAddress { get; }
    DbSet<Phone> Phone { get; }
    DbSet<Address> Address { get; }

    // CRM features
    DbSet<Lead> Lead { get; }
    DbSet<Opportunity> Opportunity { get; }
    DbSet<OpportunityProduct> OpportunityProduct { get; }
    DbSet<Product> Product { get; }
}
