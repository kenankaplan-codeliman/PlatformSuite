using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.AccountModal;
using CRM.Application.Modals.Common;
using CRM.Domain.Entities.Accounts;
using CRM.Domain.Enums;

namespace CRM.Application.CommandHandler
{
    public class AccountCommandHandler
    {
        private readonly IAccountRepository accountRepository;
        private readonly IReferenceRepository referenceRepository;
        private readonly IUnitOfWork unitOfWork;

        public AccountCommandHandler(IAccountRepository accountRepository, IReferenceRepository referenceRepository, IUnitOfWork unitOfWork)
        {
            this.accountRepository = accountRepository;
            this.referenceRepository = referenceRepository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<AccountListResponse> List(AccountListFilter filter, PaginationInfo paginationInfo)
        {
            var result = await accountRepository.List(filter, paginationInfo);

            return new AccountListResponse()
            {
                Data = result.Data,
                HasMore = result.HasMore,
                Page = result.Page,
                PageSize = result.PageSize
            };
        }

        public async Task<EntityReferenceList> LookupReference(string searchText, PaginationInfo paginationInfo)
        {
            var result = referenceRepository.LookupReference(EntityType.Account, searchText, paginationInfo);

            return new EntityReferenceList()
            {
                Data = result.Data,
                HasMore = result.HasMore,
                Page = result.Page,
                PageSize = result.PageSize,
            };
        }

        public async Task<AccountDetailItem> Get(Guid Id)
        {
            var entity = await accountRepository.GetAsync(Id) ?? throw new NotFoundException();

            return entity.ToModal();
        }

        public async Task<AccountDetailItem> Create(AccountDetailItem accountDetailItem)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();

                Account entity = new Account();
                entity.UpdateFrom(accountDetailItem);   

                await accountRepository.CreateAsync(entity);

                await unitOfWork.CommitTransactionAsync();

                return entity.ToModal();
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<AccountDetailItem> Update(AccountDetailItem accountDetailItem)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();
                
                var entity = await accountRepository.GetAsync(accountDetailItem.Id) ?? throw new NotFoundException();

                entity.UpdateFrom(accountDetailItem);

                await accountRepository.UpdateAsync(entity);

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

                var entity = await accountRepository.GetAsync(Id) ?? throw new NotFoundException();

                await accountRepository.DeleteAsync(entity);

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
}
