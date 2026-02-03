using CRM.Application.Interfaces;
using CRM.Application.Modals.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.CommandHandler
{
    public class UserCommandHandler
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IUserRepository userRepository;

        public UserCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;
        }


        public async Task<SearchListResponse> Search(string searchText, PaginationInfo? paginationInfo)
        {
            var result = await userRepository.Search(searchText, paginationInfo);

            return new SearchListResponse()
            {
                Data = result.Data,
                HasMore = result.HasMore,
                Page = result.Page,
                PageSize = result.PageSize,
            };
        }

    }
}
