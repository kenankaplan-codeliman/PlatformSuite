import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { DateTimeField } from "@platform/ui";
import { DetailPageLayout } from "@platform/ui";
import { FormSection } from "@platform/ui";
import { FormRow } from "@platform/ui";
import { TextField } from "@platform/ui";
import {
  SelectField,
  type SelectOption,
} from "@platform/ui";
import { TextAreaField } from "@platform/ui";
import { EntityRelationTable } from "@platform/ui";
import { ServicePath } from "@platform/ui";
import { useRouteMode } from "@platform/ui";
import { useContactQuery } from "../../../../entities/contact/api/useContactQueries";
import {
  useUpsertContact,
  useDeleteContact,
} from "../../../../entities/contact/api/useContactMutations";
import { contactSchema } from "../../../../entities/contact/model/schema";
import type {
  ContactFormValues,
  ContactStatus,
} from "../../../../entities/contact/model/types";
import { RoutePaths } from "../../../../app/router/paths";

const CONTACT_STATUSES: ContactStatus[] = [
  "Active",
  "DoNotContact",
  "Unsubscribed",
  "Inactive",
];

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
  const { t: tEnumStatus } = useTranslation("enums");

  const query = useContactQuery(id);
  const upsert = useUpsertContact();
  const deleteMutation = useDeleteContact();

  const title = useMemo(() => {
    if (mode === "new") return tPage("newTitle");
    if (mode === "edit") return tPage("editTitle");
    const data = query.data;
    if (data) return `${data.firstName} ${data.lastName}`.trim();
    return tPage("viewTitle");
  }, [mode, query.data, tPage]);

  const statusOptions: SelectOption<ContactStatus>[] = CONTACT_STATUSES.map(
    (value) => ({
      value,
      label: tEnumStatus(`contactStatus.${value}`),
    }),
  );

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
    >
      <GeneralSection statusOptions={statusOptions} />
      <DetailsSection />
      <AccountsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    statusOptions,
  }: {
    statusOptions: SelectOption<ContactStatus>[];
  }) {
    const form = useFormContext<ContactFormValues>();
    return (
      <FormSection title={tEntity("sections.general")} collapsible>
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
        <SelectField<ContactFormValues, ContactStatus>
          name="contactStatus"
          control={form.control}
          label={tEntity("fields.contactStatus.label")}
          options={statusOptions}
          required
        />
      </FormSection>
    );
  }

  function AccountsSection() {
    const form = useFormContext<ContactFormValues>();
    return (
      <FormSection title={tEntity("sections.accounts")} collapsible>
        <EntityRelationTable<ContactFormValues>
          name="accountContacts"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          keyField="accountId"
          keyNameField="accountName"
          addLabel={tEntity("accounts.addLabel")}
          modalTitle={tEntity("accounts.modalTitle")}
          nameColumnTitle={tEntity("accounts.nameColumn")}
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<ContactFormValues>();
    return (
      <FormSection title={tEntity("sections.details")} collapsible>
        <DateTimeField
          name="birthDate"
          control={form.control}
          label={tEntity("fields.birthDate.label")}
        />
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
