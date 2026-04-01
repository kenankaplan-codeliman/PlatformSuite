import axios from "axios";

interface FieldError {
  field: string;
  errors: string[];
}

interface ApiErrorResponse {
  detail?: string;
  errors?: FieldError[];
}

export function handleError(error: unknown): string {

  let errorMessage: string | null = null;

  if (axios.isAxiosError(error)) {

    // Server Side Errors
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          errorMessage = "Geçersiz istek";
          break;
        case 401:
          errorMessage = "Kullanıcı adı veya şifre hatalı";
          break;
        case 403:
          errorMessage = "Yetkiniz yok";
          break;
        case 404:
          errorMessage = "Kaynak bulunamadı";
          break;
        case 500:
          errorMessage = "Sunucu hatası. Lütfen daha sonra deneyin";
          break;
        default:
          errorMessage = "Beklenmeyen bir hata oluştu";
      }

      const responseData = error.response.data as ApiErrorResponse;

      // Backend detail message
      const backendMessage = responseData?.detail;
      if (backendMessage) {
        errorMessage = backendMessage;
      }

      // Validation errors
      const validationErrors = responseData?.errors;

      if (validationErrors?.length) {
        errorMessage = validationErrors
          .flatMap(fe => fe.errors)
          .join(", ");
      }
    }

    // Network / CORS / Timeout
    else if (error.request) {
      errorMessage = "Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin";
    }
  }

  return errorMessage ?? "Beklenmeyen bir hata oluştu";
}

export default handleError;
