
using CRM.Application.Exceptions;
using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Application.Modals.LeadModal;
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
        public async Task<LeadListResponse> List(LeadListFilter? filter, PaginationInfo? paginationInfo)
        {
            var result = leadRepository.List(filter, paginationInfo);

            var modalList = result.Data.Select(e => LeadListItem.fromEntity(e)).ToList();

            return new LeadListResponse()
            {
                Data = modalList,
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
            var result = leadRepository.Get(Id);
            if (result != null)
            {
                var modal = LeadDetailItem.fromEntity(result);

                return modal;
            }
            else
                throw new BusinessException("Lead not found.");
        }

        public async Task<LeadDetailItem> Create(LeadDetailItem leadDetail)
        {
            try
            {
                unitOfWork.BeginTransaction();

                var entity = LeadDetailItem.toEntity(leadDetail);

                leadRepository.Create(entity);

                unitOfWork.CommitTransaction();

                var resultEntity = leadRepository.Get(entity.Id);

                if (resultEntity == null)
                {
                    unitOfWork.RollbackTransaction();
                    throw new BusinessException($"Can not create Lead (Id:{entity.Id})");
                }

                var modal = LeadDetailItem.fromEntity(resultEntity);

                return modal;
            }
            catch
            {
                unitOfWork.RollbackTransaction();
                throw;
            }
        }

        public async Task<LeadDetailItem> Update(Guid Id, LeadDetailItem leadDetail)
        {
            try
            {
                unitOfWork.BeginTransaction();

                var entity = leadRepository.Get(Id);

                entity = LeadDetailItem.toEntity(leadDetail, entity);

                leadRepository.Update(entity);

                unitOfWork.CommitTransaction();

                var resultEntity = leadRepository.Get(Id);

                if (resultEntity == null)
                {
                    unitOfWork.RollbackTransaction();
                    throw new BusinessException($"Can not create Lead (Id:{entity.Id})");
                }

                var modal = LeadDetailItem.fromEntity(resultEntity);

                return modal;
            }
            catch
            {
                unitOfWork.RollbackTransaction();
                throw;
            }
        }


        public async Task Delete(Guid Id)
        {
            try
            {
                unitOfWork.BeginTransaction();

                var entity = leadRepository.Get(Id);

                if (entity == null)
                    throw new BusinessException("Lead not found.");

                leadRepository.Delete(entity);

                unitOfWork.CommitTransaction();

            }
            catch
            {
                unitOfWork.RollbackTransaction();
                throw;
            }
        }

        public async Task BulkDelete(List<Guid> Ids)
        {
            try
            {
                unitOfWork.BeginTransaction();

                foreach (var Id in Ids)
                {
                    var entity = leadRepository.Get(Id);

                    if (entity == null)
                        throw new BusinessException("Lead not found.");

                    leadRepository.Delete(entity);
                }

                unitOfWork.CommitTransaction();
            }
            catch
            {
                unitOfWork.RollbackTransaction();
                throw;
            }
        }

        public async Task BulkUpdateStatus(List<Guid> Ids, LeadStatus status)
        {
            try
            {
                unitOfWork.BeginTransaction();

                foreach (var Id in Ids)
                {
                    var entity = leadRepository.Get(Id);

                    if (entity == null)
                        throw new BusinessException("Lead not found.");


                    entity.LeadStatus = status;

                    leadRepository.Update(entity);
                }

                unitOfWork.CommitTransaction();
            }
            catch
            {
                unitOfWork.RollbackTransaction();
                throw;
            }
        }

    }
}
