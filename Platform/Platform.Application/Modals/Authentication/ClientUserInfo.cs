using System;
using System.Collections.Generic;
using System.Text;

namespace Platform.Application.Modals.Authentication
{
    public class ClientUserInfo
    {
        public required string Email { get; set; } = default!;
        public required string DisplayName { get; set; } = default!;
    }
}
