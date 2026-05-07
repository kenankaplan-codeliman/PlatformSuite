import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { DetailPageLayout } from "../../../../shared/ui/detail-page/DetailPageLayout";
import { FormSection } from "../../../../shared/ui/form/FormSection";
import { FormRow } from "../../../../shared/ui/form/FormRow";
import { TextField } from "../../../../shared/ui/form/fields/TextField";
import { NumberField } from "../../../../shared/ui/form/fields/NumberField";
import {
  SelectField,
  type SelectOption,
} from "../../../../shared/ui/form/fields/SelectField";
import { TextAreaField } from "../../../../shared/ui/form/fields/TextAreaField";
import { EntityLookupField } from "../../../../shared/ui/form/fields/EntityLookupField";
import { ServicePath } from "../../../../shared/api/servicePaths";
import { useRouteMode } from "../../../../shared/hooks/useRouteMode";
import { useAccountQuery } from "../../../../entities/account/api/useAccountQueries";
import {
  useUpsertAccount,
  useDeleteAccount,
} from "../../../../entities/account/api/useAccountMutations";
import { accountSchema } from "../../../../entities/account/model/schema";
import type {
  AccountFormValues,
  AccountStatus,
  AccountType,
} from "../../../../entities/account/model/types";
import { RoutePaths } from "../../../../app/router/paths";

const ACCOUNT_TYPES: AccountType[] = [
  "Customer",
  "Prospect",
  "Partner",
  "Vendor",
  "Competitor",
  "Other",
];
const ACCOUNT_STATUSES: AccountStatus[] = [
  "Prospect",
  "Active",
  "AtRisk",
  "Inactive",
  "Churned",
];

const emptyAccount: AccountFormValues = {
  id: "",
  accountName: "",
  accountType: "Customer",
  accountStatus: "Prospect",
  industry: null,
  annualRevenue: null,
  numberOfEmployees: null,
  website: null,
  description: null,
  parentAccount: null,
  emails: [],
  phones: [],
  addresses: [],
  contacts: [],
  isActive: true,
};

export function AccountDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation("page.accounts-detail");
  const { t: tEntity } = useTranslation("entity.account");
  const { t: tEnumStatus } = useTranslation("enums");

  const query = useAccountQuery(id);
  const upsert = useUpsertAccount();
  const deleteMutation = useDeleteAccount();

  const title = useMemo(() => {
    if (mode === "new") return tPage("newTitle");
    if (mode === "edit") return tPage("editTitle");
    return query.data?.accountName ?? tPage("viewTitle");
  }, [mode, query.data?.accountName, tPage]);

  const typeOptions: SelectOption<AccountType>[] = ACCOUNT_TYPES.map(
    (value) => ({
      value,
      label: tEnumStatus(`accountType.${value}`),
    }),
  );

  const statusOptions: SelectOption<AccountStatus>[] = ACCOUNT_STATUSES.map(
    (value) => ({
      value,
      label: tEnumStatus(`accountStatus.${value}`),
    }),
  );

  return (
    <DetailPageLayout<AccountFormValues>
      mode={mode}
      title={title}
      schema={accountSchema}
      defaultValues={emptyAccount}
      data={query.data as AccountFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.AccountView(saved.id)}
    >
      <GeneralSection
        typeOptions={typeOptions}
        statusOptions={statusOptions}
      />
      <DetailsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    typeOptions,
    statusOptions,
  }: {
    typeOptions: SelectOption<AccountType>[];
    statusOptions: SelectOption<AccountStatus>[];
  }) {
    const form = useFormContext<AccountFormValues>();
    return (
      <FormSection title={tEntity("sections.general")}>
        <TextField
          name="accountName"
          control={form.control}
          label={tEntity("fields.accountName.label")}
          placeholder={tEntity("fields.accountName.placeholder")}
          required
          maxLength={200}
        />
        <FormRow>
          <SelectField<AccountFormValues, AccountType>
            name="accountType"
            control={form.control}
            label={tEntity("fields.accountType.label")}
            options={typeOptions}
            required
          />
          <SelectField<AccountFormValues, AccountStatus>
            name="accountStatus"
            control={form.control}
            label={tEntity("fields.accountStatus.label")}
            options={statusOptions}
            required
          />
        </FormRow>
        <TextField
          name="industry"
          control={form.control}
          label={tEntity("fields.industry.label")}
          placeholder={tEntity("fields.industry.placeholder")}
          maxLength={200}
        />
        <EntityLookupField
          name="parentAccount"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          label={tEntity("fields.parentAccount.label")}
          allowClear
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<AccountFormValues>();
    return (
      <FormSection title={tEntity("sections.details")}>
        <TextField
          name="website"
          control={form.control}
          label={tEntity("fields.website.label")}
          placeholder={tEntity("fields.website.placeholder")}
          maxLength={500}
        />
        <FormRow columns={3}>
          <NumberField
            name="annualRevenue"
            control={form.control}
            label={tEntity("fields.annualRevenue.label")}
            min={0}
            precision={2}
            columns={2}
          />
          <NumberField
            name="numberOfEmployees"
            control={form.control}
            label={tEntity("fields.numberOfEmployees.label")}
            min={0}
            columns={1}
          />
        </FormRow>
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
