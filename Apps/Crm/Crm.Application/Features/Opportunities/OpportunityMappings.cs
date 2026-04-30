using Crm.Application.Features.Opportunities.Commands.CreateOpportunity;
using Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;
using Crm.Application.Features.Opportunities.Dtos;
using Crm.Domain.Entities.Opportunities;
using Mapster;

namespace Crm.Application.Features.Opportunities;

public static class OpportunityMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Opportunity, OpportunityDetailItem>()
            .Map(d => d.AccountName, s => s.Account != null ? s.Account.AccountName : null)
            .Map(d => d.PrimaryContactName, s => s.PrimaryContact != null
                ? (s.PrimaryContact.FirstName + " " + s.PrimaryContact.LastName).Trim()
                : null);

        config.NewConfig<Opportunity, OpportunityListItem>()
            .Map(d => d.AccountName, s => s.Account != null ? s.Account.AccountName : null);

        config.NewConfig<CreateOpportunityCommand, Opportunity>()
            .Ignore(d => d.Id,
                    d => d.Account, d => d.PrimaryContact,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateOpportunityCommand, Opportunity>()
            .IgnoreNullValues(true)
            .Ignore(d => d.Id,
                    d => d.Account, d => d.PrimaryContact,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);
    }
}
