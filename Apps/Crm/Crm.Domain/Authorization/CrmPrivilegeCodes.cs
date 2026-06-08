namespace Crm.Domain.Authorization;

public static class CrmPrivilegeCodes
{
    public static class AccountPrivilegeCodes
    {
        public const string Read = "Account.Read";
        public const string Create = "Account.Create";
        public const string Update = "Account.Update";
        public const string Delete = "Account.Delete";
        public const string Assign = "Account.Assign";
        public const string State = "Account.State";
    }

    public static class ContactPrivilegeCodes
    {
        public const string Read = "Contact.Read";
        public const string Create = "Contact.Create";
        public const string Update = "Contact.Update";
        public const string Delete = "Contact.Delete";
        public const string Assign = "Contact.Assign";
        public const string State = "Contact.State";
    }

    public static class LeadPrivilegeCodes
    {
        public const string Read = "Lead.Read";
        public const string Create = "Lead.Create";
        public const string Update = "Lead.Update";
        public const string Delete = "Lead.Delete";
        public const string Assign = "Lead.Assign";
        public const string State = "Lead.State";
        public const string Convert = "Lead.Convert";
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

    public static class ProductPrivilegeCodes
    {
        public const string Read = "Product.Read";
        public const string Create = "Product.Create";
        public const string Update = "Product.Update";
        public const string Delete = "Product.Delete";
        public const string State = "Product.State";
    }
}
