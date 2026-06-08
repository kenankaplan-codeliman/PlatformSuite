/**
 * CRM uygulamasına özgü servis yolları — Crm.Api Controller route'ları ile birebir.
 * Platform endpoint'leri @platform/ui ServicePath'ten gelir; CRM kendi sayfaları için bunu extend eder.
 */
const ApiBase = '/api';

const ControllerPaths = {
  Lead: `${ApiBase}/lead`,
  Opportunity: `${ApiBase}/opportunity`,
  Product: `${ApiBase}/product`,
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
} as const;
