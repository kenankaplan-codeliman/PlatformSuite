export const ServiceBasePath = import.meta.env.VITE_API_BASE_URL;
export const ControllerPaths = {
  AuthPath: `${ServiceBasePath}/auth`,
  Dashboard:`${ServiceBasePath}/api/dashboard`,
  UserPath: `${ServiceBasePath}/api/user`,
  LeadPath: `${ServiceBasePath}/api/lead`,
  AccountPath: `${ServiceBasePath}/api/account`,
  ContactPath: `${ServiceBasePath}/api/contact`,
  ProductPath: `${ServiceBasePath}/api/product`,
  OpportunityPath: `${ServiceBasePath}/api/opportunity`,
  ActivityPath: `${ServiceBasePath}/api/activity`,
  AuditPath: `${ServiceBasePath}/api/audit`,
} as const;


export const ServicePath = {
    
    Dashboard: {
        LeadStats: `${ControllerPaths.Dashboard}/lead-stats`,
        AccountStats: `${ControllerPaths.Dashboard}/account-stats`,
        OpportunityStats: `${ControllerPaths.Dashboard}/opportunity-stats`,
        RevenueStats: `${ControllerPaths.Dashboard}/revenue-stats`,
        RecentLeads:`${ControllerPaths.Dashboard}/recent-leads`,
        UpcomingActivities: `${ControllerPaths.Dashboard}/upcoming-activities`,
    },

    Auth: {
        Login: `${ControllerPaths.AuthPath}/login`,
        MicrosoftCallback: `${ControllerPaths.AuthPath}/microsoft/callback`,
        RefreshToken: `${ControllerPaths.AuthPath}/refresh`,
        Logout: `${ControllerPaths.AuthPath}/logout`,
        Me: `${ControllerPaths.AuthPath}/me`,
    },

    Activity: {
        List: `${ControllerPaths.ActivityPath}/list`,
        Calendar: `${ControllerPaths.ActivityPath}/calendar`,

        CreateEmail: `${ControllerPaths.ActivityPath}/create/email`,
        CreatePhoneCall: `${ControllerPaths.ActivityPath}/create/phonecall`,
        CreateTask: `${ControllerPaths.ActivityPath}/create/task`,
        CreateAppointment: `${ControllerPaths.ActivityPath}/create/appointment`,

        UpdateEmail: `${ControllerPaths.ActivityPath}/update/email`,
        UpdatePhoneCall: `${ControllerPaths.ActivityPath}/update/phonecall`,
        UpdateTask: `${ControllerPaths.ActivityPath}/update/task`,
        UpdateAppointment: `${ControllerPaths.ActivityPath}/update/appointment`,

        GetEmail: `${ControllerPaths.ActivityPath}/get/email`,
        GetPhoneCall: `${ControllerPaths.ActivityPath}/get/phonecall`,
        GetTask: `${ControllerPaths.ActivityPath}/get/task`,
        GetAppointment: `${ControllerPaths.ActivityPath}/get/appointment`,
        
        Delete: `${ControllerPaths.ActivityPath}/delete`,
        BulkUpdateStatus: `${ControllerPaths.ActivityPath}/bulk-update-status`,
        Complete: `${ControllerPaths.ActivityPath}/complete`,
        Cancel: `${ControllerPaths.ActivityPath}/cancel`,
        Assign: `${ControllerPaths.ActivityPath}/assign`,
        State: `${ControllerPaths.ActivityPath}/set-state`,
    },

    User: {
        Search: `${ControllerPaths.UserPath}/search`,
    },

     Lead: {
        List: `${ControllerPaths.LeadPath}/list`,
        Search: `${ControllerPaths.LeadPath}/search`,
        Get: `${ControllerPaths.LeadPath}/get`,
        Create: `${ControllerPaths.LeadPath}/create`,
        Update: `${ControllerPaths.LeadPath}/update`,
        Delete: `${ControllerPaths.LeadPath}/delete`,
        Assign: `${ControllerPaths.LeadPath}/assign`,
        State: `${ControllerPaths.LeadPath}/set-state`,
        UpdateStatus:`${ControllerPaths.LeadPath}/bulk-update-status`,
    },

    Account:{
        List: `${ControllerPaths.AccountPath}/list`,
        Search: `${ControllerPaths.AccountPath}/search`,
        Get: `${ControllerPaths.AccountPath}/get`,
        Create: `${ControllerPaths.AccountPath}/create`,
        Update: `${ControllerPaths.AccountPath}/update`,
        Delete: `${ControllerPaths.AccountPath}/delete`,
        Assign: `${ControllerPaths.AccountPath}/assign`,
        State: `${ControllerPaths.AccountPath}/set-state`,
        BulkUpdateStatus: `${ControllerPaths.AccountPath}/bulk-update-status`,
    },

    Contact:{
        List: `${ControllerPaths.ContactPath}/list`,
        Search: `${ControllerPaths.ContactPath}/search`,
        Get: `${ControllerPaths.ContactPath}/get`,
        Create: `${ControllerPaths.ContactPath}/create`,
        Update: `${ControllerPaths.ContactPath}/update`,
        Delete: `${ControllerPaths.ContactPath}/delete`,
        Assign: `${ControllerPaths.ContactPath}/assign`,
        State: `${ControllerPaths.ContactPath}/set-state`,
        BulkUpdateStatus: `${ControllerPaths.ContactPath}/bulk-update-status`,
    },

    Product:{
        Search: `${ControllerPaths.ProductPath}/search`,
    },

    Opportunity:{
        List: `${ControllerPaths.OpportunityPath}/list`,
        Search: `${ControllerPaths.OpportunityPath}/search`,
        Get: `${ControllerPaths.OpportunityPath}/get`,
        Create: `${ControllerPaths.OpportunityPath}/create`,
        Update: `${ControllerPaths.OpportunityPath}/update`,
        Delete: `${ControllerPaths.OpportunityPath}/delete`,
        Assign: `${ControllerPaths.OpportunityPath}/assign`,
        State: `${ControllerPaths.OpportunityPath}/set-state`,
        BulkUpdateStage: `${ControllerPaths.OpportunityPath}/bulk-update-stage`,
    },

    Audit:{
        Get: `${ControllerPaths.AuditPath}/get`,
    },

};

export default ServicePath;