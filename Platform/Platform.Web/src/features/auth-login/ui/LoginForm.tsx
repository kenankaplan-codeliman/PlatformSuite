import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/Button";
import { Alert } from "../../../shared/ui/feedback/Alert";
import { TextField } from "../../../shared/ui/form/fields/TextField";
import { PasswordField } from "../../../shared/ui/form/fields/PasswordField";
import { RoutePaths } from "../../../app/router/paths";
import { loginSchema, type LoginFormValues } from "../model/loginSchema";
import { initialLoginState, type LoginIntent } from "../model/intent";
import { loginReducer } from "../model/reducer";
import { useLoginMutation } from "../api/useLoginMutation";

export function LoginForm() {
  const { t } = useTranslation("feature.auth-login");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);
  const loginMutation = useLoginMutation();

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    const intent: LoginIntent = {
      type: "SUBMIT_CREDENTIALS",
      email: values.email,
      password: values.password,
    };
    dispatch(intent);

    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      dispatch({ type: "SUBMIT_SUCCESS" });
      navigate(RoutePaths.Home, { replace: true });
    } catch (error) {
      dispatch({ type: "SUBMIT_FAILURE", error: error as never });
    }
  });

  // Error mesajı: field error varsa zod'dan, yoksa feature-specific i18n key'inden
  const errorMessage = resolveErrorMessage(state.error, t);

  // Field error mesajları `common:errors.required` gibi ns:key formatında; çeviriye verilir
  return (
    <form onSubmit={onSubmit} noValidate>
      {state.error && (
        <Alert
          type="error"
          message={errorMessage}
          closable
          onClose={() => dispatch({ type: "RESET_ERROR" })}
        />
      )}

      <div style={{ marginTop: 16 }}>
        <TextField
          name="email"
          control={control}
          label={t("fields.email.label")}
          placeholder={t("fields.email.placeholder")}
          autoComplete="email"
          autoFocus
          required
        />
        <PasswordField
          name="password"
          control={control}
          label={t("fields.password.label")}
          placeholder={t("fields.password.placeholder")}
          autoComplete="current-password"
          required
        />

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={state.status === "submitting" || formState.isSubmitting}
        >
          {t("submit")}
        </Button>
      </div>

      {/* react-hook-form error mesajları i18n key'i olarak gelir, Form.Item help üzerinden antd'nin kendi locale akışına düşürmek yerine
          TextField/PasswordField içinde `help` prop'u üzerinden key basılır; burada kullanıcıya görsel uyumluluk için tCommon yardımcı. */}
      {Object.keys(formState.errors).length > 0 && !state.error && (
        <div style={{ marginTop: 8 }}>
          <small style={{ color: "rgba(0,0,0,0.45)" }}>
            {tCommon("validation.title")}
          </small>
        </div>
      )}
    </form>
  );
}

function resolveErrorMessage(
  error: { message: string; status?: number } | null,
  t: (key: string) => string,
): string | undefined {
  if (!error) return undefined;
  if (error.status === 401) return t("errors.invalidCredentials");
  // mapAxiosError i18n key döndürüyorsa onu kullan, değilse generic
  if (
    error.message.startsWith("common:") ||
    error.message.startsWith("feature.")
  ) {
    // i18next key — çeviri katmanı üstte
    return error.message;
  }
  return error.message || t("errors.generic");
}
