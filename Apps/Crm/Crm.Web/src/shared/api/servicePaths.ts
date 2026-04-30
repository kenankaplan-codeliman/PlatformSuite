/**
 * CRM uygulamasına özgü servis yolları — Crm.Api Controller route'ları ile birebir.
 * Platform endpoint'leri @platform/ui ServicePath'ten gelir; CRM kendi sayfaları için bunu extend eder.
 */
const ApiBase = '/api';

const ControllerPaths = {
  Lead: `${ApiBase}/lead`,
  Opportunity: `${ApiBase}/opportunity`,
} as const;

export const CrmServicePath = {
  Lead: {
    List: `${ControllerPaths.Lead}/list`,
    Get: `${ControllerPaths.Lead}/get`,
    Create: `${ControllerPaths.Lead}/create`,
    Update: `${ControllerPaths.Lead}/update`,
    Delete: `${ControllerPaths.Lead}/delete`,
  },
  Opportunity: {
    List: `${ControllerPaths.Opportunity}/list`,
    Get: `${ControllerPaths.Opportunity}/get`,
    Create: `${ControllerPaths.Opportunity}/create`,
    Update: `${ControllerPaths.Opportunity}/update`,
    Delete: `${ControllerPaths.Opportunity}/delete`,
  },
} as const;
