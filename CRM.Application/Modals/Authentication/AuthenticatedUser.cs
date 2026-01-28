using CRM.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Modals
{
    public class AuthenticatedUser
    {
        public required AuthenticationToken Token { get; set; }
        public required AppUser User { get; set; }
        public AppOrganization? Organization { get; set; }
    }
}
