
export const toLocalISO = (date: Date | string | null | undefined): string | null => {
  if (!date) return null;

  const d = date instanceof Date ? date : new Date(date);
  
  if (isNaN(d.getTime())) return null; // invalid date guard
  
  const off = d.getTimezoneOffset();

  return new Date(d.getTime() - off * 60000).toISOString().slice(0, -1);
};