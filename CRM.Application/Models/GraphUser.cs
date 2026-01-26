using System;
using System.Collections.Generic;
using System.Text;

namespace CRM.Application.Models
{
    public class GraphUser
    {
        public string Id { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string? GivenName { get; set; }
        public string? Surname { get; set; }
        public string? Mail { get; set; }
        public string? UserPrincipalName { get; set; }
        public string? JobTitle { get; set; }
        public string? MobilePhone { get; set; }
        public string? OfficeLocation { get; set; }
    }
}
