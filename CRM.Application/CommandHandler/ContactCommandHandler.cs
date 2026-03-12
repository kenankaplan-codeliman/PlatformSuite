using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.ContactModal;
using CRM.Domain.Entities.Contacts;
using CRM.Domain.Enums;

namespace CRM.Application.CommandHandler;

public class ContactCommandHandler
{
    private readonly IContactRepository contactRepository;
    private readonly IReferenceRepository referenceRepository;
    private readonly IUnitOfWork unitOfWork;

    public ContactCommandHandler(IContactRepository contactRepository, IReferenceRepository referenceRepository, IUnitOfWork unitOfWork)
    {
        this.contactRepository = contactRepository;
        this.referenceRepository = referenceRepository;
        this.unitOfWork = unitOfWork;
    }

    public async Task<ContactListResponse> ListAsync(ContactListFilters filter, PaginationInfo paginationInfo)
    {
        var result = await contactRepository.List(filter, paginationInfo);

        return new ContactListResponse()
        {
            Data = result.Data,
            HasMore = result.HasMore,
            Page = result.Page,
            PageSize = result.PageSize
        };
    }

    public async Task<EntityReferenceList> SearchAsync(string searchText, PaginationInfo paginationInfo)
    {
        var result = referenceRepository.LookupReference(EntityType.Contact, searchText, paginationInfo);

        return new EntityReferenceList()
        {
            Data = result.Data,
            HasMore = result.HasMore,
            Page = result.Page,
            PageSize = result.PageSize,
        };
    }

    public async Task<ContactDetailItem> GetAsync(Guid Id)
    {
        var result = await contactRepository.GetAsync(Id) ?? throw new NotFoundException();

        return result.ToModal();

    }

    public async Task<ContactDetailItem> CreateAsync(ContactDetailItem contactDetailItem)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            Contact entity = new Contact();
            entity.UpdateFrom(contactDetailItem);

            await contactRepository.CreateAsync(entity);

            await unitOfWork.CommitTransactionAsync();

            return entity.ToModal();
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<ContactDetailItem> UpdateAsync(ContactDetailItem contactDetailItem)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            var entity = await contactRepository.GetAsync(contactDetailItem.Id) ?? throw new NotFoundException(); ;
            entity.UpdateFrom(contactDetailItem);

            await contactRepository.UpdateAsync(entity);

            await unitOfWork.CommitTransactionAsync();

            return entity.ToModal();
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task DeleteAsync(List<Guid> Ids)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            foreach (var id in Ids)
            {
                var entity = await contactRepository.GetAsync(id) ?? throw new NotFoundException();
                await contactRepository.DeleteAsync(entity);
            }

            await unitOfWork.CommitTransactionAsync();

        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task AssignAsync(List<Guid> Ids, Guid ownerId)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            await contactRepository.AssignAsync(Ids, ownerId);

            await unitOfWork.CommitTransactionAsync();

        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task SetStateAsync(List<Guid> Ids, bool isActive)
    {
        try
        {
            await unitOfWork.BeginTransactionAsync();

            await contactRepository.SetStateAsync(Ids, isActive);

            await unitOfWork.CommitTransactionAsync();

        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }



}
