using CRM.Application.Modals;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Interfaces
{
    public interface IMicrosoftGraphService
    {
        Task<GraphUser?> GetUserInfoAsync(string accessToken);
    }
}
