using CRM.Application.Interfaces;
using CRM.Application.Modals.ActivityModal;
using CRM.Application.Modals.Common;
using CRM.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Infrastructure.Repositories
{
    public class ActivityRepository : IActivityRepository
    {
        private readonly DatabaseContext dbContext;

        public ActivityRepository(DatabaseContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public Task<PaginationResult<ActivityBaseModal>> ListAsync(ActivityListFilters? filter, PaginationInfo? paginationInfo)
        {
            throw new NotImplementedException();
        }
    }
}
