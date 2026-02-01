using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Authentication.Interfaces
{
    public interface ICurrentUserContext
    {
        Guid UserId { get; }
        string Email { get; }
        string DisplayName { get; }
        Guid OrganizationId { get; }
        AccessLevel AccessLevel { get; }
        List<Guid> AccessibleOrganizationList { get; }
        
    }
}
