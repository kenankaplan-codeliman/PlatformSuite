using Platform.Application.Modals;
using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Interfaces
{
    public interface IMicrosoftGraphService
    {
        Task<GraphUser?> GetUserInfoAsync(string accessToken);
    }
}
