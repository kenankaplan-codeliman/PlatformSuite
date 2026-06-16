import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AttachmentsField,
  commonDocumentTypes,
  CurrencyField,
  DetailPageLayout,
  FormRow,
  FormSection,
  NumberField,
  RelatedActivitiesTab,
  SelectField,
  TextAreaField,
  TextField,
  useGeneralParameters,
  useOwnerAssignAction,
  useRouteMode,
  useSetStateAction,
  type DetailPageAction,
  type DetailPageTab,
  type SelectOption,
} from "@platform/ui";
import { CrmServicePath } from "../../../../shared/api/servicePaths";
import { AddressField } from "../../../../widgets/address-field";
import { EmailField } from "../../../../widgets/email-field";
import { PhoneField } from "../../../../widgets/phone-field";
import { useLeadConvertAction } from "../../../../features/lead-convert";
import { useLeadQuery } from "../../../../entities/lead/api/useLeadQueries";
import {
  useDeleteLead,
  useUpsertLead,
} from "../../../../entities/lead/api/useLeadMutations";
import { leadSchema } from "../../../../entities/lead/model/schema";
import type { LeadFormValues } from "../../../../entities/lead/model/types";
import { RoutePaths } from "../../../../app/router/paths";

const emptyLead: LeadFormValues = {
  id: "",
  subject: "",
  firstName: null,
  lastName: null,
  title: null,
  department: null,
  company: null,
  industry: null,
  website: null,
  source: "Other",
  status: "New",
  rating: null,
  score: null,
  estimatedValue: null,
  estimatedValueCurrency: null,
  description: null,
  emails: [],
  phones: [],
  addresses: [],
  convertedAccountId: null,
  convertedContactId: null,
  isActive: true,
};

export function LeadDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation("page.leads-detail");
  const { t: tEntity } = useTranslation("entity.lead");
  const { t: tCommon } = useTranslation("common");

  const query = useLeadQuery(id);
  const upsert = useUpsertLead();
  const deleteMutation = useDeleteLead();

  // source / status / rating GeneralParameter'dan beslenir — statik enum yok.
  const { options: statusOptions } = useGeneralParameters("LeadStatus");
  const { options: sourceOptions } = useGeneralParameters("LeadSource");

  // Sahip atama + Aktif/Pasif: ayrı action endpoint'leri (save'e dahil değil),
  // kendi privilege'larıyla; başarıda footer + detail query tazelenir.
  const ownerAssign = useOwnerAssignAction({
    entityId: id,
    entityType: "Lead",
    servicePath: CrmServicePath.Lead.Assign,
  });
  const stateToggle = useSetStateAction({
    entityId: id,
    entityType: "Lead",
    servicePath: CrmServicePath.Lead.SetState,
    isActive: query.data?.isActive ?? true,
    onSuccess: () => {
      void query.refetch();
    },
  });

  // Convert: ayrı action + dialog. Zaten Converted ise gizlenir.
  const convert = useLeadConvertAction({
    leadId: id,
    alreadyConverted: query.data?.status === "Converted",
  });

  const extraActions = [
    convert.action,
    ownerAssign.action,
    stateToggle.action,
  ].filter((a): a is DetailPageAction => a !== null);

  // new/edit başlığı DetailPageLayout'ta entityType'tan generic üretilir;
  // burada yalnız view modunun kayıt adını sağlıyoruz.
  const title = useMemo(
    () => query.data?.subject ?? tPage("viewTitle"),
    [query.data?.subject, tPage],
  );

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
            content: <RelatedActivitiesTab entityType="Lead" entityId={id} />,
          },
          {
            key: "attachments",
            label: tCommon("tabs.attachments"),
            content: (
              <div style={{ marginBottom: 16 }}>
                <AttachmentsField
                  entityType="Lead"
                  entityId={id}
                  documentTypes={commonDocumentTypes}
                />
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <DetailPageLayout<LeadFormValues>
      mode={mode}
      title={title}
      schema={leadSchema}
      defaultValues={emptyLead}
      data={query.data as LeadFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => {
        await upsert.mutateAsync(values);
      }}
      onDelete={
        id
          ? async () => {
              await deleteMutation.mutateAsync(id);
            }
          : undefined
      }
      afterSaveNavigation={(saved) => RoutePaths.LeadView(saved.id)}
      tabs={tabs}
      entityType="Lead"
      entityId={id}
      extraActions={extraActions}
    >
      {ownerAssign.modal}
      {convert.modal}
      <GeneralSection
        sourceOptions={sourceOptions}
        statusOptions={statusOptions}
      />
      <CompanySection />
      <PersonSection />
      <DetailsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    sourceOptions,
    statusOptions,
  }: {
    sourceOptions: SelectOption<string>[];
    statusOptions: SelectOption<string>[];
  }) {
    const form = useFormContext<LeadFormValues>();
    const { options: currencyOptions } = useGeneralParameters("CurrencyType");
    const { options: ratingOptions } = useGeneralParameters("LeadRating");
    return (
      <FormSection title={tEntity("sections.general")}>
        <TextField
          name="subject"
          control={form.control}
          label={tEntity("fields.subject.label")}
          placeholder={tEntity("fields.subject.placeholder")}
          required
          maxLength={250}
        />
        <FormRow>
          <SelectField<LeadFormValues>
            name="status"
            control={form.control}
            label={tEntity("fields.status.label")}
            options={statusOptions}
            required
          />
          <SelectField<LeadFormValues>
            name="source"
            control={form.control}
            label={tEntity("fields.source.label")}
            options={sourceOptions}
            required
          />
        </FormRow>
        <FormRow columns={5}>
          <SelectField<LeadFormValues>
            name="rating"
            control={form.control}
            label={tEntity("fields.rating.label")}
            options={ratingOptions}
            allowClear
            columns={2}
          />
          <NumberField
            name="score"
            control={form.control}
            label={tEntity("fields.score.label")}
            min={0}
            max={100}
            columns={1}
          />
        </FormRow>
        <FormRow columns={5}>
          <CurrencyField<LeadFormValues>
            name="estimatedValue"
            control={form.control}
            label={tEntity("fields.estimatedValue.label")}
            min={0}
            precision={2}
            columns={2}
          />
          <SelectField<LeadFormValues>
            name="estimatedValueCurrency"
            control={form.control}
            label={tEntity("fields.estimatedValueCurrency.label")}
            options={currencyOptions}
            allowClear
            columns={1}
          />
        </FormRow>
      </FormSection>
    );
  }

  function CompanySection() {
    const form = useFormContext<LeadFormValues>();
    return (
      <FormSection title={tEntity("sections.company")} collapsible="expanded">
        <TextField
          name="company"
          control={form.control}
          label={tEntity("fields.company.label")}
          maxLength={250}
        />
        <FormRow columns={2}>
          <TextField
            name="industry"
            control={form.control}
            label={tEntity("fields.industry.label")}
            maxLength={150}
          />
          <TextField
            name="website"
            control={form.control}
            label={tEntity("fields.website.label")}
            maxLength={250}
          />
        </FormRow>
      </FormSection>
    );
  }

  function PersonSection() {
    const form = useFormContext<LeadFormValues>();
    return (
      <FormSection title={tEntity("sections.person")} collapsible="expanded">
        <FormRow>
          <TextField
            name="firstName"
            control={form.control}
            label={tEntity("fields.firstName.label")}
            maxLength={100}
          />
          <TextField
            name="lastName"
            control={form.control}
            label={tEntity("fields.lastName.label")}
            maxLength={100}
          />
        </FormRow>
        <FormRow>
          <TextField
            name="title"
            control={form.control}
            label={tEntity("fields.title.label")}
            maxLength={150}
          />
          <TextField
            name="department"
            control={form.control}
            label={tEntity("fields.department.label")}
            maxLength={200}
          />
        </FormRow>
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<LeadFormValues>();
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

  function CommunicationInfoTab() {
    const form = useFormContext<LeadFormValues>();
    return (
      <>
        <FormSection title={tEntity("sections.emails")} collapsible="expanded">
          <EmailField<LeadFormValues> control={form.control} name="emails" />
        </FormSection>
        <FormSection title={tEntity("sections.phones")} collapsible="expanded">
          <PhoneField<LeadFormValues> control={form.control} name="phones" />
        </FormSection>
        <FormSection
          title={tEntity("sections.addresses")}
          collapsible="expanded"
        >
          <AddressField<LeadFormValues>
            control={form.control}
            name="addresses"
          />
        </FormSection>
      </>
    );
  }
}
