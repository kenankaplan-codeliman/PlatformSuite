using CRM.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace CRM.Application.Interfaces;

public interface IContextUser
{
    Guid UserId { get; }
    string Email { get; }
    string DisplayName { get; }
    Guid OrganizationId { get; }
    string OrganizationName { get; }
    List<Guid> AccessibleOrganizationList { get; }
    Dictionary<String, AccessLevel> PrivilegesCodes { get; }
}
