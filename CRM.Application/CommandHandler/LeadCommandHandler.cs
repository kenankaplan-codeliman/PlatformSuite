
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.LeadModal;
using CRM.Application.Modals.OpportunityModal;
using CRM.Domain.Entities.Leads;
using CRM.Domain.Enums;

namespace CRM.Application.CommandHandler
{
    public class LeadCommandHandler
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ILeadRepository leadRepository;
        private readonly IReferenceRepository referenceRepository;

        public LeadCommandHandler(
            IUnitOfWork unitOfWork, 
            ILeadRepository leadRepository, 
            IReferenceRepository referenceRepository  )
        {
            this.leadRepository = leadRepository;
            this.unitOfWork = unitOfWork;
            this.referenceRepository = referenceRepository;
        }
        public async Task<LeadListResponse> List(LeadListFilter filter, PaginationInfo paginationInfo)
        {
            var result = await leadRepository.List(filter, paginationInfo);

            return new LeadListResponse()
            {
                Data = result.Data,
                HasMore = result.HasMore,
                Page = result.Page,
                PageSize = result.PageSize,
            };
        }

        public async Task<EntityReferenceList> LookupReference(string searchText, PaginationInfo paginationInfo)
        {
            var result = referenceRepository.LookupReference(EntityType.Lead, searchText, paginationInfo);

            return new EntityReferenceList() { 
                Data = result.Data,
                HasMore = result.HasMore,
                Page = result.Page,
                PageSize = result.PageSize,
            };
        }

        public async Task<LeadDetailItem> Get(Guid Id)
        {
            var result = await leadRepository.GetAsync(Id) ?? throw new NotFoundException();

            return result.ToModal();
        }

        public async Task<LeadDetailItem> Create(LeadDetailItem leadDetailItem)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();

                Lead entity = new Lead();
                entity.UpdateFrom(leadDetailItem);

                await leadRepository.CreateAsync(entity);
                await unitOfWork.CommitTransactionAsync();

                entity = await leadRepository.GetAsync(entity.Id) ?? throw new NotFoundException();
                return entity.ToModal();
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<LeadDetailItem> Update(LeadDetailItem leadDetailItem)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();

                var entity = await leadRepository.GetAsync(leadDetailItem.Id) ?? throw new NotFoundException();
                entity.UpdateFrom(leadDetailItem);

                await leadRepository.UpdateAsync(entity);
                await unitOfWork.CommitTransactionAsync();

                entity = await leadRepository.GetAsync(entity.Id) ?? throw new NotFoundException();
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

                var entity = await leadRepository.GetAsync(Id) ?? throw new NotFoundException();

                await leadRepository.DeleteAsync(entity);
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
            try
            {
                await unitOfWork.BeginTransactionAsync();

                foreach (var Id in Ids)
                {
                    var entity = await leadRepository.GetAsync(Id) ?? throw new NotFoundException();
                    await leadRepository.DeleteAsync(entity);
                }

                await unitOfWork.CommitTransactionAsync();
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task BulkUpdateStatus(List<Guid> Ids, LeadStatus status)
        {
            try
            {
                await unitOfWork.BeginTransactionAsync();

                foreach (var Id in Ids)
                {
                    var entity =await leadRepository.GetAsync(Id) ?? throw new NotFoundException();
                    entity.LeadStatus = status;

                    await leadRepository.UpdateAsync(entity);
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
