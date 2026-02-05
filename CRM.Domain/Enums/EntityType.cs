using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace CRM.Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EntityType
    {
        None, User, Account, Contact, Lead, Opportunity
    }
}
