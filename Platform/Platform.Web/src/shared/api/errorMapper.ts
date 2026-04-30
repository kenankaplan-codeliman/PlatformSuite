import type { AxiosError } from 'axios';
import type { AppError, ProblemDetails, ValidationProblemDetails } from '../types/ApiError';
import { isValidationProblem } from '../types/ApiError';

/**
 * Axios error'ı uygulamanın standart AppError tipine çevirir.
 * Backend'ten gelen RFC 7807 ProblemDetails parse edilir.
 */
export function mapAxiosError(error: unknown): AppError {
  const axiosError = error as AxiosError<ProblemDetails>;

  if (!axiosError?.isAxiosError) {
    return {
      code: 'Unknown',
      message: 'common:messages.unexpectedError',
    };
  }

  if (!axiosError.response) {
    return {
      code: 'Network',
      message: 'common:errors.network',
    };
  }

  const status = axiosError.response.status;
  const pd = axiosError.response.data;

  if (pd && isValidationProblem(pd)) {
    const validationPd = pd as ValidationProblemDetails;
    return {
      code: validationPd.code ?? 'Validation',
      message: validationPd.title ?? validationPd.detail ?? 'common:validation.title',
      status,
      fieldErrors: validationPd.errors,
    };
  }

  return {
    code: pd?.code ?? `HTTP_${status}`,
    message: pd?.detail ?? pd?.title ?? 'common:messages.unexpectedError',
    status,
  };
}
