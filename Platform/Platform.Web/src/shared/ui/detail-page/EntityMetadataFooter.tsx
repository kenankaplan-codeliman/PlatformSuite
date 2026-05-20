import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormSection } from "../form/FormSection";
import { FormRow } from "../form/FormRow";
import { FormModeProvider } from "../form/FormModeContext";
import { EntityLookupField } from "../form/fields/EntityLookupField";
import { DateTimeField } from "../form/fields/DateTimeField";
import { CheckboxField } from "../form/fields/CheckboxField";
import { Spinner } from "../feedback/Spinner";
import { ServicePath } from "../../api/servicePaths";
import { useEntityMetadata } from "../../api/entityMetadata";
import type { EntityReference } from "../../types/EntityReference";

export interface EntityMetadataFooterProps {
  /** Backend CLR tip adı (ör. "Account", "Supplier"). */
  entityType: string;
  /** Kayıt Id'si. Yoksa (new mode) footer render edilmez. */
  entityId?: string;
}

/** Footer salt-okunur formunun değerleri — entity'den bağımsız ortak metadata. */
interface MetadataFormValues {
  owner: EntityReference | null;
  organization: EntityReference | null;
  createdBy: EntityReference | null;
  createdAt: string | null;
  updatedBy: EntityReference | null;
  updatedAt: string | null;
  isActive: boolean;
}

const EMPTY: MetadataFormValues = {
  owner: null,
  organization: null,
  createdBy: null,
  createdAt: null,
  updatedBy: null,
  updatedAt: null,
  isActive: false,
};

/**
 * Tüm Detail sayfalarının altında, entity'den bağımsız ortak metadata bölümü:
 * sahip, organizasyon, durum ve audit (oluşturan/güncelleyen + tarih). Veri tek
 * generic endpoint'ten (api/entity-metadata/get) gelir; sayfa başına ek kod gerekmez.
 *
 * Diğer bölümlerle uyum için projenin mode-aware field primitifleri kullanılır
 * (view modunda salt-okunur): EntityLookupField / DateTimeField / CheckboxField.
 * Owner/state DEĞİŞTİRME burada yapılmaz — yalnızca görüntüleme.
 */
export function EntityMetadataFooter({ entityType, entityId }: EntityMetadataFooterProps) {
  const { t } = useTranslation("common");
  const { data, isLoading } = useEntityMetadata(entityType, entityId);

  const form = useForm<MetadataFormValues>({ defaultValues: EMPTY });

  useEffect(() => {
    if (!data) return;
    form.reset({
      owner: data.owner ?? null,
      organization: data.organization ?? null,
      createdBy: data.createdBy ?? null,
      createdAt: data.createdAt ?? null,
      updatedBy: data.updatedBy ?? null,
      updatedAt: data.updatedAt ?? null,
      isActive: data.isActive,
    });
  }, [data, form]);

  if (!entityId) return null;

  return (
    <FormSection title={t("metadata.title", { defaultValue: "Kayıt Bilgileri" })} collapsible>
      {isLoading || !data ? (
        <Spinner />
      ) : (
        <FormModeProvider mode="view" isDirty={false}>
          <FormRow>
            <EntityLookupField
              name="owner"
              control={form.control}
              servicePath={ServicePath.User.Search}
              entityType="AuthUser"
              label={t("metadata.owner", { defaultValue: "Sahibi" })}
              force="readonly"
            />
            <EntityLookupField
              name="organization"
              control={form.control}
              servicePath={ServicePath.AppOrganization.Search}
              entityType="Organization"
              label={t("metadata.organization", { defaultValue: "Organizasyon" })}
              force="readonly"
            />
          </FormRow>
          <FormRow>
            <EntityLookupField
              name="createdBy"
              control={form.control}
              servicePath={ServicePath.User.Search}
              entityType="AuthUser"
              label={t("metadata.createdBy", { defaultValue: "Oluşturan" })}
              force="readonly"
            />
            <DateTimeField
              name="createdAt"
              control={form.control}
              label={t("metadata.createdAt", { defaultValue: "Oluşturulma" })}
              showTime
              force="readonly"
            />
          </FormRow>
          <FormRow>
            <EntityLookupField
              name="updatedBy"
              control={form.control}
              servicePath={ServicePath.User.Search}
              entityType="AuthUser"
              label={t("metadata.updatedBy", { defaultValue: "Güncelleyen" })}
              force="readonly"
            />
            <DateTimeField
              name="updatedAt"
              control={form.control}
              label={t("metadata.updatedAt", { defaultValue: "Güncellenme" })}
              showTime
              force="readonly"
            />
          </FormRow>
          <FormRow>
            <CheckboxField
              name="isActive"
              control={form.control}
              label={t("metadata.isActive", { defaultValue: "Aktif" })}
              force="readonly"
            />
          </FormRow>
        </FormModeProvider>
      )}
    </FormSection>
  );
}
