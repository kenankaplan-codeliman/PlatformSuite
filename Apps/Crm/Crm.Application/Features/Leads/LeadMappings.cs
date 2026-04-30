using Crm.Application.Features.Leads.Commands.CreateLead;
using Crm.Application.Features.Leads.Commands.UpdateLead;
using Crm.Application.Features.Leads.Dtos;
using Crm.Domain.Entities.Leads;
using Mapster;

namespace Crm.Application.Features.Leads;

public static class LeadMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Lead, LeadDetailItem>()
            .Map(d => d.ConvertedAccountName, s => s.ConvertedAccount != null ? s.ConvertedAccount.AccountName : null)
            .Map(d => d.ConvertedContactName, s => s.ConvertedContact != null
                ? (s.ConvertedContact.FirstName + " " + s.ConvertedContact.LastName).Trim()
                : null);

        config.NewConfig<Lead, LeadListItem>()
            .Map(d => d.FullName, s => string.Join(" ", new[] { s.FirstName, s.LastName }
                .Where(p => !string.IsNullOrWhiteSpace(p))));

        config.NewConfig<CreateLeadCommand, Lead>()
            .Ignore(d => d.Id,
                    d => d.ConvertedAccount, d => d.ConvertedContact,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateLeadCommand, Lead>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.ConvertedAccount, d => d.ConvertedContact,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
