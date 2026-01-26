import axios from "axios";
import { useLoadingModal } from '@/components/LoadingModal';

interface HandleErrorOptions {
  showMessage?: boolean;
}

interface FieldError {
  field: string;
  errors: string[];
}

export function useHandleError() {

  const { showError } = useLoadingModal();

  function handleError(
    error: unknown,
    options: HandleErrorOptions = { showMessage: true }
  ): string {

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

        //Server Error Detail Message
        const backendMessage = (error.response.data as any)?.detail;
        if (backendMessage) {
          errorMessage = backendMessage;
        }

        const validationErrors = error.response.data.errors as FieldError[];

        if (validationErrors && validationErrors.length > 0) {
          
          const validationMessages = validationErrors
            .flatMap(fe => fe.errors)
            .join(", ");

          if (validationMessages) {
            errorMessage = validationMessages;
          }
        }

      }

      // Network / Cors / Timeout Error
      else if (error.request) {
        errorMessage = "Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin";
      }

    }

    // Client Side Errors
    if (!errorMessage) {
      errorMessage = "Beklenmeyen bir hata oluştu";
    }

    if (options.showMessage) {
      showError('Error', errorMessage);
    }

    return errorMessage;
  }

  return { handleError };
}
