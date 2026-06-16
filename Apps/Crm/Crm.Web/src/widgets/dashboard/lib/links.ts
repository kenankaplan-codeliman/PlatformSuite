/**
 * Dashboard satırlarının detay sayfası linkleri. app/router/paths (üst katman) import
 * etmemek için entity detay yolları burada lokal tutulur (FSD: widget → app importu yasak).
 */

// Aktivite polimorfik: route /activities/:type/:id (type slug). Platform entities/activity ile aynı.
const ACTIVITY_SLUG: Record<string, string> = {
  PhoneCall: 'phonecall',
  Task: 'task',
  Appointment: 'appointment',
  Email: 'email',
};

export const dashboardLinks = {
  opportunity: (id: string) => `/opportunities/${id}`,
  lead: (id: string) => `/leads/${id}`,
  account: (id: string) => `/accounts/${id}`,
  contact: (id: string) => `/contacts/${id}`,
  activity: (activityType: string, id: string) =>
    `/activities/${ACTIVITY_SLUG[activityType] ?? activityType.toLowerCase()}/${id}`,
};
