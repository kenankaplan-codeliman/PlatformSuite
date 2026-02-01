
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

        public LeadCommandHandler(ILeadRepository leadRepository, IUnitOfWork unitOfWork)
        {
            this.leadRepository = leadRepository;
            this.unitOfWork = unitOfWork;
        }
        public async Task<LeadListResponse> List(LeadListFilter? filter, PaginationInfo? paginationInfo)
        {
            var result = await leadRepository.ListAsync(filter, paginationInfo);

            var modalList = result.Data.Select(e => LeadListItem.fromEntity(e)).ToList();

            return new LeadListResponse()
            {
                Data = modalList,
                HasMore = result.HasMore,
                Page = result.Page,
                PageSize = result.PageSize,
            };
        }

        public async Task<LeadDetailItem> Get(Guid Id)
        {
            var result = await leadRepository.GetAsync(Id);
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
                await this.unitOfWork.BeginTransactionAsync();

                var entity = LeadDetailItem.toEntity(leadDetail);

                await leadRepository.CreateAsync(entity);

                await this.unitOfWork.CommitAsync();

                var resultEntity = await leadRepository.GetAsync(entity.Id);

                if (resultEntity == null)
                {
                    await this.unitOfWork.RollbackAsync();
                    throw new BusinessException($"Can not create Lead (Id:{entity.Id})");
                }

                var modal = LeadDetailItem.fromEntity(resultEntity);

                return modal;
            }
            catch
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task<LeadDetailItem> Update(Guid Id, LeadDetailItem leadDetail)
        {
            try
            {
                await this.unitOfWork.BeginTransactionAsync();

                var entity = await leadRepository.GetAsync(Id);

                if (entity == null)
                    throw new BusinessException("Lead not found.");

                entity = LeadDetailItem.toEntity(leadDetail, entity);

                await leadRepository.UpdateAsync(entity);

                await this.unitOfWork.CommitAsync();

                var resultEntity = await leadRepository.GetAsync(Id);

                if (resultEntity == null)
                {
                    await this.unitOfWork.RollbackAsync();
                    throw new BusinessException($"Can not create Lead (Id:{entity.Id})");
                }

                var modal = LeadDetailItem.fromEntity(resultEntity);

                return modal;
            }
            catch
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }
        }


        public async Task Delete(Guid Id)
        {
            try
            {
                await this.unitOfWork.BeginTransactionAsync();

                var entity = await leadRepository.GetAsync(Id);

                if (entity == null)
                    throw new BusinessException("Lead not found.");

                await leadRepository.DeleteAsync(entity);

                await this.unitOfWork.CommitAsync();

            }
            catch
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task BulkDelete(List<Guid> Ids)
        {
            try
            {
                await this.unitOfWork.BeginTransactionAsync();

                foreach (var Id in Ids)
                {
                    var entity = await leadRepository.GetAsync(Id);

                    if (entity == null)
                        throw new BusinessException("Lead not found.");

                    await leadRepository.DeleteAsync(entity);
                }

                await this.unitOfWork.CommitAsync();
            }
            catch
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }
        }

        public async Task BulkUpdateStatus(List<Guid> Ids, LeadStatus status)
        {
            try
            {
                await this.unitOfWork.BeginTransactionAsync();

                foreach (var Id in Ids)
                {
                    var entity = await leadRepository.GetAsync(Id);

                    if (entity == null)
                        throw new BusinessException("Lead not found.");


                    entity.LeadStatus = status;

                    await leadRepository.UpdateAsync(entity);
                }

                await this.unitOfWork.CommitAsync();
            }
            catch
            {
                await this.unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
