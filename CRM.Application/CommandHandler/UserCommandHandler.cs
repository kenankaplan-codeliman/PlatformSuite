using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.CommandHandler
{
    public class UserCommandHandler
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IUserRepository userRepository;
        private readonly IReferenceRepository referenceRepository;


        public UserCommandHandler(
            IUnitOfWork unitOfWork,
            IUserRepository userRepository, 
            IReferenceRepository referenceRepository
            )
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;
            this.referenceRepository = referenceRepository;
        }


        public async Task<EntityReferenceList> LookupReference(string searchText, PaginationInfo paginationInfo)
        {
            var result = referenceRepository.LookupReference(EntityType.User, searchText, paginationInfo);

            return result;
        }

    }
}
