import { useEffect, useMemo, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Dropdown, Modal, Space, Tabs, Typography } from "antd";
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

  onSubmit: SubmitHandler<TValues>;
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

  children: ReactNode;
}

const DETAILS_TAB_KEY = "details";
const TAB_QUERY_PARAM = "tab";

export function DetailPageLayout<TValues extends FieldValues>({
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
  children,
}: DetailPageLayoutProps<TValues>) {
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode: FormMode = modeOverride ?? rawMode;

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
    await onSubmit(values);
    if (afterSaveNavigation) {
      navigate(afterSaveNavigation(values));
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
            onClick={() => navigate(`${pathname}/edit`)}
          >
            {tCommon("actions.edit")}
          </Button>
        </Space>
      );
    }

    return (
      <Space size={8}>
        <Button onClick={() => navigate(-1)}>
          {tCommon("actions.cancel")}
        </Button>
        <Button
          type="primary"
          loading={form.formState.isSubmitting}
          onClick={() => form.handleSubmit(handleSubmit)()}
        >
          {tCommon("actions.save")}
        </Button>
      </Space>
    );
  };

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
            onClick={() => navigate(-1)}
            aria-label={tCommon("actions.back")}
          />
          <Title
            level={4}
            style={{
              margin: 0,
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.88)",
            }}
          >
            {title}
          </Title>
        </Space>
        {renderActions()}
      </div>

      <FormModeProvider mode={mode} isDirty={form.formState.isDirty}>
        <FormProvider {...form}>
          {tabs && tabs.length > 0 ? (
            <Tabs
              activeKey={
                tabs.some((t) => t.key === searchParams.get(TAB_QUERY_PARAM))
                  ? (searchParams.get(TAB_QUERY_PARAM) as string)
                  : DETAILS_TAB_KEY
              }
              onChange={(key) => {
                const next = new URLSearchParams(searchParams);
                if (key === DETAILS_TAB_KEY) {
                  next.delete(TAB_QUERY_PARAM);
                } else {
                  next.set(TAB_QUERY_PARAM, key);
                }
                setSearchParams(next, { replace: true });
              }}
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
    </div>
  );
}
