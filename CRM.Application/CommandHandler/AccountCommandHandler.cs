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

        public async Task<AccountListResponse> ListAsync(AccountListFilter filter, PaginationInfo paginationInfo)
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

        public async Task<EntityReferenceList> SearchAsync(string searchText, PaginationInfo paginationInfo)
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

        public async Task<AccountDetailItem> GetAsync(Guid Id)
        {
            var entity = await accountRepository.GetAsync(Id) ?? throw new NotFoundException();

            return entity.ToModal();
        }

        public async Task<AccountDetailItem> CreateAsync(AccountDetailItem accountDetailItem)
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

        public async Task<AccountDetailItem> UpdateAsync(AccountDetailItem accountDetailItem)
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

        public async Task DeleteAsync(List<Guid> Ids)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();

                foreach (var id in Ids)
                {
                    var entity = await accountRepository.GetAsync(id) ?? throw new NotFoundException();
                    await accountRepository.DeleteAsync(entity);
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

                await accountRepository.AssignAsync(Ids, ownerId);

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

                await accountRepository.SetStateAsync(Ids, isActive);

                await unitOfWork.CommitTransactionAsync();

            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task BulkUpdateStatusAsync(List<Guid> Ids, AccountStatus status)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();

                foreach (var id in Ids)
                {
                    var entity = await accountRepository.GetAsync(id) ?? throw new NotFoundException();
                    entity.AccountStatus = status;
                    await accountRepository.UpdateAsync(entity);
                }

                await unitOfWork.CommitTransactionAsync();
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

    }
}
