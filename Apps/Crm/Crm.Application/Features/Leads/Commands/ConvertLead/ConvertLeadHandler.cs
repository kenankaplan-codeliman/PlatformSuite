using Crm.Application.Common.Communications;
using Crm.Application.Features.Leads.Dtos;
using Crm.Application.Interfaces;
using Crm.Domain.Entities.Accounts;
using Crm.Domain.Entities.Contacts;
using Crm.Domain.Entities.Leads;
using Crm.Domain.Entities.Opportunities;
using Platform.Application.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Features.Leads.Commands.ConvertLead;

public sealed class ConvertLeadHandler : IRequestHandler<ConvertLeadCommand, Result<ConvertLeadResult>>
{
    private readonly ILeadRepository _leadRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly IContactRepository _contactRepository;
    private readonly IOpportunityRepository _opportunityRepository;
    private readonly ICommunicationRepository _communications;
    private readonly ICrmDbContext _db;

    public ConvertLeadHandler(
        ILeadRepository leadRepository,
        IAccountRepository accountRepository,
        IContactRepository contactRepository,
        IOpportunityRepository opportunityRepository,
        ICommunicationRepository communications,
        ICrmDbContext db)
    {
        _leadRepository = leadRepository;
        _accountRepository = accountRepository;
        _contactRepository = contactRepository;
        _opportunityRepository = opportunityRepository;
        _communications = communications;
        _db = db;
    }

    public async Task<Result<ConvertLeadResult>> Handle(ConvertLeadCommand request, CancellationToken cancellationToken)
    {
        var lead = await _leadRepository.GetAsync(request.Id, cancellationToken);
        if (lead is null) return LeadErrors.NotFound;
        if (lead.Status == "Converted") return LeadErrors.AlreadyConverted;

        var linkExisting = request.AccountId.HasValue;
        var createAccount = request.CreateAccount && !linkExisting;

        var linkExistingContact = request.ContactId.HasValue;
        var createContact = request.CreateContact && !linkExistingContact;

        Guid? accountId = request.AccountId;
        if (linkExisting)
        {
            var exists = await _db.Account.AsNoTracking()
                .AnyAsync(a => a.Id == request.AccountId!.Value, cancellationToken);
            if (!exists) return LeadErrors.AccountNotFound;
        }

        if (linkExistingContact)
        {
            var exists = await _db.Contact.AsNoTracking()
                .AnyAsync(c => c.Id == request.ContactId!.Value, cancellationToken);
            if (!exists) return LeadErrors.ContactNotFound;
        }

        // En az bir hedef seçilmeli (yeni/var olan firma ya da kişi).
        if (accountId is null && !createAccount && !createContact && !linkExistingContact)
            return LeadErrors.NothingToConvert;

        // Fırsat oluşturmak için firma (yeni ya da bağlı) zorunlu.
        if (request.CreateOpportunity && !createAccount && accountId is null)
            return LeadErrors.OpportunityRequiresAccount;

        // Lead iletişimleri — hedef Account/Contact'a bire bir kopyalanır.
        // (SyncAsync yeni parent scope'ta eşleşme bulamaz → her satır yeni kayıt olur.)
        var (emails, phones, addresses) =
            await _db.LoadCommunicationsAsync(nameof(Lead), lead.Id, cancellationToken);

        // 1) Firma
        if (createAccount)
        {
            var account = new Account
            {
                AccountName = !string.IsNullOrWhiteSpace(lead.Company) ? lead.Company! : lead.Subject,
                Industry = lead.Industry,
                Website = lead.Website,
                Description = lead.Description,
            };
            await _accountRepository.CreateAsync(account, cancellationToken);
            await _communications.SyncAsync(nameof(Account), account.Id, emails, phones, addresses, cancellationToken);
            accountId = account.Id;
        }

        // 2) Kişi
        Guid? contactId = null;
        if (createContact)
        {
            var contact = new Contact
            {
                FirstName = lead.FirstName ?? string.Empty,
                LastName = lead.LastName ?? string.Empty,
                Title = lead.Title,
                Department = lead.Department,
                Description = lead.Description,
            };
            await _contactRepository.CreateAsync(contact, cancellationToken);
            await _communications.SyncAsync(nameof(Contact), contact.Id, emails, phones, addresses, cancellationToken);
            contactId = contact.Id;

            // Firma varsa yeni kişiyi birincil olarak ilişkilendir.
            if (accountId is not null)
            {
                _db.AccountContact.Add(new AccountContact
                {
                    AccountId = accountId.Value,
                    ContactId = contact.Id,
                    IsPrimary = true,
                });
                await _db.SaveChangesAsync(cancellationToken);
            }
        }
        else if (linkExistingContact)
        {
            contactId = request.ContactId;

            // Firma varsa mevcut kişiyi ilişkilendir (birincil değil; zaten bağlıysa ekleme).
            if (accountId is not null)
            {
                var alreadyLinked = await _db.AccountContact
                    .AnyAsync(ac => ac.AccountId == accountId.Value && ac.ContactId == contactId.Value, cancellationToken);
                if (!alreadyLinked)
                {
                    _db.AccountContact.Add(new AccountContact
                    {
                        AccountId = accountId.Value,
                        ContactId = contactId.Value,
                        IsPrimary = false,
                    });
                    await _db.SaveChangesAsync(cancellationToken);
                }
            }
        }

        // 3) Fırsat (opsiyonel — firma zorunlu)
        Guid? opportunityId = null;
        if (request.CreateOpportunity && accountId is not null)
        {
            var opportunity = new Opportunity
            {
                Name = lead.Subject,
                AccountId = accountId.Value,
                PrimaryContactId = contactId,
                Stage = "Prospecting",
                EstimatedAmount = lead.EstimatedValue,
                Currency = lead.EstimatedValueCurrency,
            };
            await _opportunityRepository.CreateAsync(opportunity, cancellationToken);
            opportunityId = opportunity.Id;
        }

        // 4) Lead'i Converted işaretle + bağlantıları yaz.
        lead.Status = "Converted";
        lead.ConvertedAccountId = accountId;
        lead.ConvertedContactId = contactId;
        lead.ConvertedAt = DateTime.UtcNow;
        await _leadRepository.UpdateAsync(lead, cancellationToken);

        return new ConvertLeadResult
        {
            LeadId = lead.Id,
            AccountId = accountId,
            ContactId = contactId,
            OpportunityId = opportunityId,
        };
    }
}
