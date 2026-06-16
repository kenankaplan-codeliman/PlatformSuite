import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { DateTimeField } from "@platform/ui";
import { DetailPageLayout } from "@platform/ui";
import { FormSection } from "@platform/ui";
import { FormRow } from "@platform/ui";
import { TextField } from "@platform/ui";
import { SelectField, type SelectOption } from "@platform/ui";
import { TextAreaField } from "@platform/ui";
import { EntityLookupField } from "@platform/ui";
import { CheckboxField } from "@platform/ui";
import { TableField, type TableFieldColumn } from "@platform/ui";
import { ServicePath } from "@platform/ui";
import { useRouteMode } from "@platform/ui";
import { useOwnerAssignAction } from "@platform/ui";
import { useSetStateAction } from "@platform/ui";
import type { DetailPageAction } from "@platform/ui";
import { useGeneralParameters } from "@platform/ui";
import { RelatedActivitiesTab, type DetailPageTab } from "@platform/ui";
import { AttachmentsField } from "@platform/ui";
import { AddressField } from "../../../../widgets/address-field";
import { EmailField } from "../../../../widgets/email-field";
import { PhoneField } from "../../../../widgets/phone-field";
import { useContactQuery } from "../../../../entities/contact/api/useContactQueries";
import {
  useUpsertContact,
  useDeleteContact,
} from "../../../../entities/contact/api/useContactMutations";
import { contactSchema } from "../../../../entities/contact/model/schema";
import type {
  ContactAccountModal,
  ContactFormValues,
} from "../../../../entities/contact/model/types";
import {
  contactDocumentTypes,
  getContactDocumentTypeLabel,
} from "../../../../entities/contact/model/documentTypes";
import { RoutePaths } from "../../../../app/router/paths";

const CONTACT_ATTACHMENT_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";

const emptyContact: ContactFormValues = {
  id: "",
  firstName: "",
  lastName: "",
  contactStatus: "Active",
  title: null,
  department: null,
  birthDate: null,
  description: null,
  accountContacts: [],
  emails: [],
  phones: [],
  addresses: [],
  isActive: true,
};

export function ContactDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation("page.contacts-detail");
  const { t: tEntity } = useTranslation("entity.contact");
  const { t: tCommon } = useTranslation("common");

  const query = useContactQuery(id);
  const upsert = useUpsertContact();
  const deleteMutation = useDeleteContact();

  // contactStatus GeneralParameter'dan beslenir — statik enum yok.
  const { options: statusOptions } = useGeneralParameters("ContactStatus");

  // Sahip atama + Aktif/Pasif: ayrı action endpoint'leri (save'e dahil değil),
  // kendi privilege'larıyla; başarıda footer + detail query tazelenir.
  const ownerAssign = useOwnerAssignAction({
    entityId: id,
    entityType: "Contact",
    servicePath: ServicePath.Contact.Assign,
  });
  const stateToggle = useSetStateAction({
    entityId: id,
    entityType: "Contact",
    servicePath: ServicePath.Contact.SetState,
    isActive: query.data?.isActive ?? true,
    onSuccess: () => {
      void query.refetch();
    },
  });
  const extraActions = [ownerAssign.action, stateToggle.action].filter(
    (a): a is DetailPageAction => a !== null,
  );

  // new/edit başlığı DetailPageLayout'ta entityType'tan generic üretilir;
  // burada yalnız view modunun kayıt adını sağlıyoruz.
  const title = useMemo(() => {
    const data = query.data;
    if (data) return `${data.firstName} ${data.lastName}`.trim();
    return tPage("viewTitle");
  }, [query.data, tPage]);

  // İletişim Bilgileri her modda var (form-bound, entity ile kaydedilir).
  // Activities/Attachments yalnız kayıtlı entity'de (kendi servisleri, entityId gerekir).
  const tabs: DetailPageTab[] = [
    {
      key: "communication-info",
      label: tEntity("sections.communicationInfo"),
      content: <CommunicationInfoTab />,
    },
    ...(id && mode !== "new"
      ? [
          {
            key: "activities",
            label: tCommon("tabs.activities"),
            content: (
              <RelatedActivitiesTab entityType="Contact" entityId={id} />
            ),
          },
          {
            key: "attachments",
            label: tCommon("tabs.attachments"),
            content: (
              <div style={{ marginBottom: 16 }}>
                <AttachmentsField
                  entityType="Contact"
                  entityId={id}
                  accept={CONTACT_ATTACHMENT_ACCEPT}
                  documentTypes={contactDocumentTypes}
                  documentTypeLabel={getContactDocumentTypeLabel}
                />
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <DetailPageLayout<ContactFormValues>
      mode={mode}
      title={title}
      schema={contactSchema}
      defaultValues={emptyContact}
      data={query.data as ContactFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => {
        await upsert.mutateAsync(values);
      }}
      onDelete={
        id
          ? async () => {
              await deleteMutation.mutateAsync([id]);
            }
          : undefined
      }
      afterSaveNavigation={(saved) => RoutePaths.ContactView(saved.id)}
      tabs={tabs}
      entityType="Contact"
      entityId={id}
      extraActions={extraActions}
    >
      {ownerAssign.modal}
      <GeneralSection statusOptions={statusOptions} />
      <DetailsSection />
      <AccountsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    statusOptions,
  }: {
    statusOptions: SelectOption<string>[];
  }) {
    const form = useFormContext<ContactFormValues>();
    return (
      <FormSection title={tEntity("sections.general")}>
        <FormRow>
          <TextField
            name="firstName"
            control={form.control}
            label={tEntity("fields.firstName.label")}
            placeholder={tEntity("fields.firstName.placeholder")}
            required
            maxLength={100}
          />
          <TextField
            name="lastName"
            control={form.control}
            label={tEntity("fields.lastName.label")}
            placeholder={tEntity("fields.lastName.placeholder")}
            required
            maxLength={100}
          />
        </FormRow>
        <FormRow>
          <TextField
            name="title"
            control={form.control}
            label={tEntity("fields.title.label")}
            placeholder={tEntity("fields.title.placeholder")}
            maxLength={200}
          />
          <TextField
            name="department"
            control={form.control}
            label={tEntity("fields.department.label")}
            placeholder={tEntity("fields.department.placeholder")}
            maxLength={200}
          />
        </FormRow>
        <FormRow>
          <SelectField<ContactFormValues>
            name="contactStatus"
            control={form.control}
            label={tEntity("fields.contactStatus.label")}
            options={statusOptions}
            required
          />
          <DateTimeField
            name="birthDate"
            control={form.control}
            label={tEntity("fields.birthDate.label")}
          />
        </FormRow>
      </FormSection>
    );
  }

  function CommunicationInfoTab() {
    const form = useFormContext<ContactFormValues>();
    return (
      <>
        <FormSection
          title={tEntity("sections.emails")}
          collapsible="expanded"
          flush
        >
          <EmailField<ContactFormValues> control={form.control} name="emails" />
        </FormSection>
        <FormSection
          title={tEntity("sections.phones")}
          collapsible="expanded"
          flush
        >
          <PhoneField<ContactFormValues> control={form.control} name="phones" />
        </FormSection>
        <FormSection
          title={tEntity("sections.addresses")}
          collapsible="expanded"
        >
          <AddressField<ContactFormValues>
            control={form.control}
            name="addresses"
          />
        </FormSection>
      </>
    );
  }

  function AccountsSection() {
    const form = useFormContext<ContactFormValues>();

    // IsPrimary tek-açık (radio davranışı): bir satır primary yapılınca diğerleri kapanır.
    const enforceSinglePrimary = (
      rowIndex: number,
      field: string,
      value: unknown,
    ) => {
      if (field !== "isPrimary" || value !== true) return;
      const rows = form.getValues("accountContacts") ?? [];
      rows.forEach((_, i) => {
        if (i === rowIndex) return;
        const path =
          `accountContacts.${i}.isPrimary` as `accountContacts.${number}.isPrimary`;
        if (form.getValues(path)) {
          form.setValue(path, false, { shouldDirty: true });
        }
      });
    };

    const columns: TableFieldColumn<ContactFormValues, ContactAccountModal>[] =
      [
        {
          key: "account",
          header: tEntity("accounts.nameColumn"),
          width: "1fr",
          render: ({ path }) => (
            <EntityLookupField
              name={path("account")}
              control={form.control}
              servicePath={ServicePath.Account.Search}
              entityType="Account"
              required
            />
          ),
        },
        {
          key: "role",
          header: tCommon("relation.role"),
          width: "220px",
          render: ({ path }) => (
            <TextField
              name={path("role")}
              control={form.control}
              maxLength={200}
            />
          ),
        },
        {
          key: "isPrimary",
          header: tCommon("relation.primary"),
          width: "100px",
          align: "center",
          render: ({ path }) => (
            <CheckboxField name={path("isPrimary")} control={form.control} />
          ),
        },
      ];

    return (
      <FormSection
        title={tEntity("sections.accounts")}
        collapsible="expanded"
        flush
      >
        <TableField<ContactFormValues, ContactAccountModal>
          control={form.control}
          name="accountContacts"
          columns={columns}
          newRow={() => ({
            id: crypto.randomUUID(),
            account: null,
            role: null,
            isPrimary: false,
          })}
          addLabel={tEntity("accounts.addLabel")}
          onRowChange={enforceSinglePrimary}
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<ContactFormValues>();
    return (
      <FormSection title={tEntity("sections.details")} collapsible="expanded">
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity("fields.description.label")}
          rows={4}
        />
      </FormSection>
    );
  }
}
