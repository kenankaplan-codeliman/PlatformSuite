namespace Crm.Domain.Authorization;

public static class CrmPrivilegeCodes
{
    public static class LeadPrivilegeCodes
    {
        public const string Read = "Lead.Read";
        public const string Create = "Lead.Create";
        public const string Update = "Lead.Update";
        public const string Delete = "Lead.Delete";
        public const string Assign = "Lead.Assign";
        public const string State = "Lead.State";
    }

    public static class OpportunityPrivilegeCodes
    {
        public const string Read = "Opportunity.Read";
        public const string Create = "Opportunity.Create";
        public const string Update = "Opportunity.Update";
        public const string Delete = "Opportunity.Delete";
        public const string Assign = "Opportunity.Assign";
        public const string State = "Opportunity.State";
    }
}
