/**
 * CRM uygulamasına özgü servis yolları — Crm.Api Controller route'ları ile birebir.
 * Platform endpoint'leri @platform/ui ServicePath'ten gelir; CRM kendi sayfaları için bunu extend eder.
 */
const ApiBase = '/api';

const ControllerPaths = {
  Lead: `${ApiBase}/lead`,
  Opportunity: `${ApiBase}/opportunity`,
  Product: `${ApiBase}/product`,
  Dashboard: `${ApiBase}/dashboard`,
} as const;

export const CrmServicePath = {
  Lead: {
    List: `${ControllerPaths.Lead}/list`,
    Get: `${ControllerPaths.Lead}/get`,
    Create: `${ControllerPaths.Lead}/create`,
    Update: `${ControllerPaths.Lead}/update`,
    Delete: `${ControllerPaths.Lead}/delete`,
    Assign: `${ControllerPaths.Lead}/assign`,
    SetState: `${ControllerPaths.Lead}/set-state`,
    Convert: `${ControllerPaths.Lead}/convert`,
  },
  Opportunity: {
    List: `${ControllerPaths.Opportunity}/list`,
    Get: `${ControllerPaths.Opportunity}/get`,
    Create: `${ControllerPaths.Opportunity}/create`,
    Update: `${ControllerPaths.Opportunity}/update`,
    Delete: `${ControllerPaths.Opportunity}/delete`,
    Assign: `${ControllerPaths.Opportunity}/assign`,
    SetState: `${ControllerPaths.Opportunity}/set-state`,
  },
  Product: {
    List: `${ControllerPaths.Product}/list`,
    Search: `${ControllerPaths.Product}/search`,
    Get: `${ControllerPaths.Product}/get`,
    Create: `${ControllerPaths.Product}/create`,
    Update: `${ControllerPaths.Product}/update`,
    Delete: `${ControllerPaths.Product}/delete`,
    SetState: `${ControllerPaths.Product}/set-state`,
  },
  Dashboard: {
    // Her widget kendi endpoint'ini asenkron çağırır.
    Kpi: {
      OpenOpportunities: `${ControllerPaths.Dashboard}/kpi/open-opportunities`,
      WonThisMonth: `${ControllerPaths.Dashboard}/kpi/won-this-month`,
      NewLeads: `${ControllerPaths.Dashboard}/kpi/new-leads`,
      ConversionRate: `${ControllerPaths.Dashboard}/kpi/conversion-rate`,
    },
    Pipeline: `${ControllerPaths.Dashboard}/pipeline`,
    ClosingOpportunities: `${ControllerPaths.Dashboard}/closing-opportunities`,
    MyTasks: `${ControllerPaths.Dashboard}/my-tasks`,
    LeadsToAttention: `${ControllerPaths.Dashboard}/leads-to-attention`,
    RecentActivities: `${ControllerPaths.Dashboard}/recent-activities`,
    TopAccounts: `${ControllerPaths.Dashboard}/top-accounts`,
    WonLost: `${ControllerPaths.Dashboard}/won-lost`,
    RecentRecords: `${ControllerPaths.Dashboard}/recent-records`,
  },
} as const;
