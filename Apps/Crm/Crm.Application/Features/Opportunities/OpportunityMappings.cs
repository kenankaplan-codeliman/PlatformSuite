using Crm.Application.Features.Opportunities.Commands.CreateOpportunity;
using Crm.Application.Features.Opportunities.Commands.UpdateOpportunity;
using Crm.Application.Features.Opportunities.Dtos;
using Crm.Domain.Entities.Opportunities;
using Platform.Application.Modals.Common;
using Platform.Domain.Enums;
using Mapster;

namespace Crm.Application.Features.Opportunities;

public static class OpportunityMappings
{
    public static void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Opportunity, OpportunityDetailItem>()
            .Map(d => d.Account, s => s.Account != null
                ? new EntityReference(EntityType.Account)
                {
                    Id = s.Account.Id,
                    Name = s.Account.AccountName,
                }
                : null)
            .Map(d => d.PrimaryContact, s => s.PrimaryContact != null
                ? new EntityReference(EntityType.Contact)
                {
                    Id = s.PrimaryContact.Id,
                    Name = (s.PrimaryContact.FirstName + " " + s.PrimaryContact.LastName).Trim(),
                }
                : null);

        config.NewConfig<Opportunity, OpportunityListItem>()
            .Map(d => d.AccountName, s => s.Account != null ? s.Account.AccountName : null);

        config.NewConfig<CreateOpportunityCommand, Opportunity>()
            .Map(d => d.AccountId, s => s.Account != null ? s.Account.Id : Guid.Empty)
            .Map(d => d.PrimaryContactId, s => s.PrimaryContact != null ? (Guid?)s.PrimaryContact.Id : null)
            .Ignore(d => d.Id,
                    d => d.Account, d => d.PrimaryContact,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt);

        config.NewConfig<UpdateOpportunityCommand, Opportunity>()
            .IgnoreNullValues(true)
            .Map(d => d.AccountId, s => s.Account != null ? s.Account.Id : Guid.Empty)
            .Ignore(d => d.PrimaryContactId)
            .Ignore(d => d.Id,
                    d => d.Account, d => d.PrimaryContact,
                    d => d.CreatedBy, d => d.CreatedAt, d => d.UpdatedBy, d => d.UpdatedAt,
                    d => d.IsDeleted, d => d.DeletedBy, d => d.DeletedAt)
            .AfterMapping((src, dst) =>
            {
                dst.PrimaryContactId = src.PrimaryContact?.Id;
            });
    }
}
