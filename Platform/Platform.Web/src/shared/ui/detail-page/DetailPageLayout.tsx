import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldErrors,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { ZodType } from "zod";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Dropdown, Modal, Space, Tabs, Typography, message } from "antd";
import type { MenuProps } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { Spinner } from "../feedback/Spinner";
import { Alert } from "../feedback/Alert";
import { FormModeProvider } from "../form/FormModeContext";
import type { FormMode } from "../../types/FormMode";
import {
  AttachmentsProvider,
  useAttachmentsCollector,
} from "../../../widgets/attachment/model/AttachmentsContext";
import { EntityMetadataFooter } from "./EntityMetadataFooter";
import { entityMetadataKeys } from "../../api/queryKeys";
import { useEntityTypeRegistry } from "../../lib/entity-type/EntityTypeRegistryContext";
import type { QuickCreateRenderProps } from "../../lib/entity-type/types";

const { Title } = Typography;

export interface DetailPageAction {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void | Promise<void>;
}

export interface DetailPageTab {
  key: string;
  label: ReactNode;
  content: ReactNode;
}

export interface DetailPageLayoutProps<TValues extends FieldValues> {
  mode: FormMode;
  modeOverride?: FormMode;

  title: string;
  schema: ZodType<TValues>;
  defaultValues: DefaultValues<TValues>;

  data?: TValues;
  isLoading?: boolean;
  error?: unknown;

  /**
   * Form geçerliyse çağrılır. Yeni kayıtta oluşturulan kaydın id'sini döndürürse
   * layout `/:newId` view'ına yönlendirir; döndürmezse listeye düşer.
   */
  onSubmit: (values: TValues) => void | string | Promise<void | string>;
  onDelete?: () => void | Promise<void>;

  /** View modunda Düzenle butonunun solundaki dropdown menüye eklenir (aktif/pasif vb). */
  extraActions?: DetailPageAction[];

  afterSaveNavigation?: (saved: TValues) => string;

  /**
   * Form alanlarının yanına ek sekmeler ekler (ör. "İlişkili Aktiviteler").
   * Verildiğinde ilk sekme her zaman form (children); diğerleri form `<form>`
   * elementinin dışında render edilir. Aktif sekme `?tab=` query param'ından okunur.
   */
  tabs?: DetailPageTab[];

  /** Form sekmesinin etiketi. Varsayılan: common.tabs.details ("Genel"). */
  detailsTabLabel?: ReactNode;

  /**
   * Verildiğinde sayfanın altında ortak metadata footer'ı (audit/owner/state)
   * gösterilir. `entityType` backend CLR tip adıdır ("Account", "Supplier", …).
   * `new` modda veya id yokken render edilmez. Tüm entity'lerde aynı çalışır;
   * sayfa başına ek kod gerektirmez.
   */
  entityType?: string;
  entityId?: string;

  /**
   * Verildiğinde layout "embedded" (modal-içi) modda çalışır: dış chrome (container
   * + header/back/edit) ve route navigasyonu kapatılır, mode `new`'e sabitlenir,
   * tab durumu URL yerine local tutulur. Kayıt başarıyla tamamlanınca `navigate`
   * yerine, `entityType` + `embeddedReferenceName` kullanılarak `EntityReference`
   * kurulur ve `embedded.onCreated(ref)` çağrılır; İptal `embedded.onCancel`'ı
   * tetikler. Lookup quick-create akışı (`EntityTypeMeta.quickCreate`) bu modu
   * kullanır — sayfa, lookup'tan gelen `QuickCreateRenderProps`'u aynen forward eder.
   */
  embedded?: QuickCreateRenderProps;
  /**
   * Embedded modda kaydedilen değerlerden `EntityReference.name`'i türetir
   * (entity'ye göre değişir: Account → accountName, Contact → ad soyad, ...).
   * Verilmezse `title` kullanılır.
   */
  embeddedReferenceName?: (saved: TValues) => string;

  children: ReactNode;
}

const DETAILS_TAB_KEY = "details";
const TAB_QUERY_PARAM = "tab";

export function DetailPageLayout<TValues extends FieldValues>(
  props: DetailPageLayoutProps<TValues>,
) {
  return (
    <AttachmentsProvider>
      <DetailPageLayoutInner {...props} />
    </AttachmentsProvider>
  );
}

function DetailPageLayoutInner<TValues extends FieldValues>({
  mode: rawMode,
  modeOverride,
  title,
  schema,
  defaultValues,
  data,
  isLoading,
  error,
  onSubmit,
  onDelete,
  extraActions,
  afterSaveNavigation,
  tabs,
  detailsTabLabel,
  entityType,
  entityId,
  embedded,
  embeddedReferenceName,
  children,
}: DetailPageLayoutProps<TValues>) {
  const { t: tCommon } = useTranslation("common");
  // Başlık "[Entity Türü]: [title]" formatında; tür ön eki field label'larıyla
  // aynı gri tonda. entityType registry'de kayıtlı değilse ön ek gösterilmez.
  const entityMeta = useEntityTypeRegistry().get(entityType);
  const entityTypeLabel = entityMeta ? tCommon(entityMeta.label) : null;
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigasyon hedefleri pathname'den türetilir; geçmiş (`navigate(-1)`) kullanılmaz.
  // `returnUrl` detail'e girerken `location.state` ile taşınır (useReturnNavigate /
  // EntityLookupField link'i); edit↔view round-trip'inde korunur. Yoksa türetilen
  // liste yoluna düşülür — refresh/deep-link/yeni sekmede de güvenli.
  const returnUrl = (location.state as { returnUrl?: string } | null)?.returnUrl;
  const listPath = pathname.replace(/\/[^/]+$/, "") || "/"; // /x/123 → /x ; /x/new → /x
  const viewPath = pathname.replace(/\/edit$/, ""); // /x/123/edit → /x/123
  const editPath = `${pathname}/edit`;
  const attachmentsCollector = useAttachmentsCollector();
  const queryClient = useQueryClient();

  // Embedded modda mode daima `new` (modal içi inline kayıt); aksi halde
  // modeOverride > rawMode (URL'den türeyen). Tab durumu embedded'da URL'i
  // kirletmemek için local tutulur.
  const mode: FormMode = embedded ? "new" : (modeOverride ?? rawMode);
  const [localTab, setLocalTab] = useState(DETAILS_TAB_KEY);

  const handleBack = () => {
    if (mode === "edit") {
      navigate(viewPath, { replace: true, state: { returnUrl } });
    } else {
      navigate(returnUrl ?? listPath); // view + new → çıkış
    }
  };

  const form = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (data && mode !== "new") {
      form.reset(data);
    }
  }, [data, mode, form]);

  const handleSubmit: SubmitHandler<TValues> = async (values) => {
    // AttachmentsField'lar pending dosyaları collector'a register etti;
    // submit anında command payload'una "attachments" olarak enjekte edilir.
    const pending = attachmentsCollector?.getPendingAttachments() ?? [];
    const payload =
      pending.length > 0
        ? ({ ...values, attachments: pending } as TValues)
        : values;
    const savedId = await onSubmit(payload);
    attachmentsCollector?.reset();
    // Kayıt güncellendi → footer'daki ortak metadata (UpdatedAt/By, durum vb.)
    // bayatladı; entity-metadata sorgusunu invalidate ederek tazele. Generic —
    // entityType/entityId veren her Detail sayfası için otomatik çalışır.
    if (entityType && entityId) {
      queryClient.invalidateQueries({
        queryKey: entityMetadataKeys.detail(entityType, entityId),
      });
    }
    // Embedded (modal-içi) modda navigasyon yok: kaydedilen değerlerden +
    // entityType'tan EntityReference kurup callback'e geri ver. Lookup quick-create
    // akışı bu referansı seçili getirir.
    if (embedded) {
      const saved = { ...payload, id: savedId } as TValues;
      embedded.onCreated({
        id: typeof savedId === "string" ? savedId : String(savedId ?? ""),
        entityType: entityType ?? "",
        name: embeddedReferenceName?.(saved) ?? title,
      });
      return;
    }
    // Kayıt sonrası navigasyon — deterministik, `navigate(-1)` kullanılmaz.
    // edit→view her zaman `replace` (edit geçmişten silinir → ping-pong döngüsü
    // imkânsız) ve returnUrl ileri taşınır (çıkışta linkleyen sayfaya/listeye döner).
    // - new : returnUrl ?? oluşturulan kaydın view'ı (`/:newId`); id yoksa listeye
    // - edit: afterSaveNavigation(payload) ?? view yolu (pathname'den /edit atılır)
    if (mode === "new") {
      const dest = returnUrl ?? (savedId ? `${listPath}/${savedId}` : listPath);
      navigate(dest, { replace: true, state: { returnUrl } });
    } else {
      const dest = afterSaveNavigation?.(payload) ?? viewPath;
      navigate(dest, { replace: true, state: { returnUrl } });
    }
  };

  // Validation başarısızsa handleSubmit'in onValid dalı hiç çalışmaz: servis çağrısı
  // yapılmaz. Geri bildirim olmadan kullanıcı "Kaydet çalışmıyor" sanır. onInvalid ile
  // hatayı görünür kıl (react-hook-form ilk hatalı alana zaten odaklanır). Konsola da
  // alan kırılımını yaz; gizli/sekme-altı zorunlu alan hatalarının teşhisini kolaylaştırır.
  const handleInvalid = (errors: FieldErrors<TValues>) => {
    message.error(tCommon("validation.title"));
    if (import.meta.env.DEV) {
      console.warn("[DetailPageLayout] validation failed:", errors);
    }
  };

  const confirmDelete = () => {
    if (!onDelete) return;
    Modal.confirm({
      title: tCommon("actions.delete"),
      okText: tCommon("actions.confirm"),
      cancelText: tCommon("actions.cancel"),
      okButtonProps: { danger: true },
      onOk: onDelete,
    });
  };

  const dropdownItems: MenuProps["items"] = useMemo(() => {
    const items: NonNullable<MenuProps["items"]> = [];

    extraActions?.forEach((action) => {
      items.push({
        key: action.key,
        label: action.label,
        icon: action.icon,
        danger: action.danger,
        disabled: action.disabled,
        onClick: () => {
          void action.onClick();
        },
      });
    });

    if (onDelete) {
      if (items.length > 0) items.push({ type: "divider" });
      items.push({
        key: "__delete",
        label: tCommon("actions.delete"),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: confirmDelete,
      });
    }

    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraActions, onDelete, tCommon]);

  if (mode !== "new" && isLoading && !data) {
    return <Spinner tip={tCommon("messages.loading")} />;
  }

  if (mode !== "new" && error) {
    return <Alert type="error" message={tCommon("messages.unexpectedError")} />;
  }

  const renderActions = () => {
    if (mode === "view") {
      return (
        <Space size={8}>
          {dropdownItems.length > 0 && (
            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button icon={<MoreOutlined />} />
            </Dropdown>
          )}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(editPath, { state: { returnUrl } })}
          >
            {tCommon("actions.edit")}
          </Button>
        </Space>
      );
    }

    return (
      <Space size={8}>
        <Button onClick={handleBack}>
          {tCommon("actions.cancel")}
        </Button>
        <Button
          type="primary"
          loading={form.formState.isSubmitting}
          onClick={() => form.handleSubmit(handleSubmit, handleInvalid)()}
        >
          {tCommon("actions.save")}
        </Button>
      </Space>
    );
  };

  // Tab aktif anahtarı: embedded'da local state, aksi halde `?tab=` query param.
  const activeTabKey = embedded
    ? localTab
    : tabs?.some((tab) => tab.key === searchParams.get(TAB_QUERY_PARAM))
      ? (searchParams.get(TAB_QUERY_PARAM) as string)
      : DETAILS_TAB_KEY;

  const handleTabChange = (key: string) => {
    if (embedded) {
      setLocalTab(key);
      return;
    }
    const next = new URLSearchParams(searchParams);
    if (key === DETAILS_TAB_KEY) {
      next.delete(TAB_QUERY_PARAM);
    } else {
      next.set(TAB_QUERY_PARAM, key);
    }
    setSearchParams(next, { replace: true });
  };

  const formContent = (
    <FormModeProvider
      mode={mode}
      isDirty={
        form.formState.isDirty || (attachmentsCollector?.isDirty ?? false)
      }
    >
      <FormProvider {...form}>
        {tabs && tabs.length > 0 ? (
          <Tabs
            activeKey={activeTabKey}
            onChange={handleTabChange}
            items={[
              {
                key: DETAILS_TAB_KEY,
                label: detailsTabLabel ?? tCommon("tabs.details"),
                children: (
                  <form
                    id="detail-page-form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                  >
                    {children}
                  </form>
                ),
              },
              ...tabs.map((tab) => ({
                key: tab.key,
                label: tab.label,
                children: tab.content,
              })),
            ]}
          />
        ) : (
          <form id="detail-page-form" onSubmit={form.handleSubmit(handleSubmit)}>
            {children}
          </form>
        )}
      </FormProvider>
    </FormModeProvider>
  );

  // Embedded: dış chrome yok (modal başlığı/geri butonu çağıran SearchModal'da).
  // Form + altta İptal/Kaydet; İptal arama görünümüne, Kaydet onSaved'a gider.
  if (embedded) {
    return (
      <>
        {formContent}
        <Space
          size={8}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <Button onClick={embedded.onCancel}>{tCommon("actions.cancel")}</Button>
          <Button
            type="primary"
            loading={form.formState.isSubmitting}
            onClick={() => form.handleSubmit(handleSubmit, handleInvalid)()}
          >
            {tCommon("actions.save")}
          </Button>
        </Space>
      </>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
          padding: "12px 16px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Space size={12} align="center">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            aria-label={tCommon("actions.back")}
          />
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.88)",
            }}
          >
            {entityTypeLabel && mode === "new" ? (
              tCommon("detailPage.newTitle", { entity: entityTypeLabel })
            ) : entityTypeLabel && mode === "edit" ? (
              tCommon("detailPage.editTitle", { entity: entityTypeLabel })
            ) : (
              <>
                {entityTypeLabel && (
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    {entityTypeLabel}:{" "}
                  </span>
                )}
                {title}
              </>
            )}
          </Title>
        </Space>
        {renderActions()}
      </div>

      {formContent}

      {mode !== "new" && entityType && entityId && (
        <EntityMetadataFooter entityType={entityType} entityId={entityId} />
      )}
    </div>
  );
}
