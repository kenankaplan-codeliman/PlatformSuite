using Crm.Application.Features.Leads.Commands.CreateLead;
using Crm.Application.Features.Leads.Commands.UpdateLead;
using Crm.Application.Features.Leads.Dtos;
using Crm.Domain.Entities.Leads;
using Platform.Application.Mapping;
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
            .Map(d => d.FullName, s => (s.FirstName + " " + s.LastName).Trim());

        config.NewConfig<CreateLeadCommand, Lead>()
            .Ignore(d => d.ConvertedAccount!, d => d.ConvertedContact!)
            .IgnoreAuditFields();

        config.NewConfig<UpdateLeadCommand, Lead>()
            .IgnoreNullValues(true)
            .Ignore(d => d.ConvertedAccount!, d => d.ConvertedContact!)
            .IgnoreAuditFields();
    }
}
