/**
 * Backend RFC 7807 ProblemDetails cevap tipleri.
 * `CRM.Api/Extensions/ResultExtensions.cs` ile uyumlu.
 */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  traceId?: string;
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;
}

export function isValidationProblem(pd: ProblemDetails): pd is ValidationProblemDetails {
  return 'errors' in pd && typeof (pd as ValidationProblemDetails).errors === 'object';
}

/** Genel uygulama hatası — UI'da toast veya alert olarak gösterilir. */
export interface AppError {
  code: string;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}
