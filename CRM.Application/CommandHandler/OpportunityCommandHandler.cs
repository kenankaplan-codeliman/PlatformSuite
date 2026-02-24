using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ContactModal;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Opportunities;
using CRM.Domain.Enums;

namespace CRM.Application.CommandHandler;

public class OpportunityCommandHandler
{
    private readonly IOpportunityRepository opportunityRepository;
    private readonly IReferenceRepository referenceRepository;
    private readonly IUnitOfWork unitOfWork;

    public OpportunityCommandHandler(IOpportunityRepository opportunityRepository, IReferenceRepository referenceRepository, IUnitOfWork unitOfWork)
    {
        this.opportunityRepository = opportunityRepository;
        this.referenceRepository = referenceRepository;
        this.unitOfWork = unitOfWork;
    }

    public async Task<OpportunityListResponse> List(OpportunityListFilters filter, PaginationInfo paginationInfo)
    {
        var result = await opportunityRepository.List(filter, paginationInfo);

        return new OpportunityListResponse()
        {
            Data = result.Data,
            HasMore = result.HasMore,
            Page = result.Page,
            PageSize = result.PageSize
        };
    }

    public async Task<EntityReferenceList> LookupReference(string searchText, PaginationInfo paginationInfo)
    {
        var result = referenceRepository.LookupReference(EntityType.Opportunity, searchText, paginationInfo);

        return new EntityReferenceList()
        {
            Data = result.Data,
            HasMore = result.HasMore,
            Page = result.Page,
            PageSize = result.PageSize,
        };
    }

    public async Task<OpportunityDetailItem> Get(Guid Id)
    {
        var result = opportunityRepository.Get(Id);
        if (result != null)
        {
            var modal = result.ToModal();

            return modal;
        }
        else
            throw new BusinessException("Contact not found.");
    }

    public async Task<OpportunityDetailItem> Create(OpportunityDetailItem opportunityDetailItem)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            Opportunity entity = new Opportunity();
            entity.UpdateFrom(opportunityDetailItem);

            opportunityRepository.Create(entity);
            await unitOfWork.CommitTransactionAsync();

            return entity.ToModal();
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OpportunityDetailItem> Update(OpportunityDetailItem opportunityDetailItem)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            var entity = opportunityRepository.Get(opportunityDetailItem.Id);
            entity.UpdateFrom(opportunityDetailItem);

            opportunityRepository.Update(entity);

            await unitOfWork.CommitTransactionAsync();

            return entity.ToModal();
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task Delete(Guid Id)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            var entity = opportunityRepository.Get(Id);

            opportunityRepository.Delete(entity);

            await unitOfWork.CommitTransactionAsync();

        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task BulkDelete(List<Guid> Ids)
    {
        foreach (var id in Ids)
        {
            await Delete(id);
        }
    }

}
