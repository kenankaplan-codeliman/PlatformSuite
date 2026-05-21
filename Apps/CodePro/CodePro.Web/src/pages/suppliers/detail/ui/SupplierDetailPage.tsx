import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  DetailPageLayout,
  FormRow,
  FormSection,
  NumberField,
  RelatedActivitiesTab,
  SelectField,
  TextAreaField,
  TextField,
  useGeneralParameters,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import { useSupplierQuery } from '../../../../entities/supplier/api/useSupplierQueries';
import {
  useDeleteSupplier,
  useUpsertSupplier,
} from '../../../../entities/supplier/api/useSupplierMutations';
import { supplierSchema } from '../../../../entities/supplier/model/schema';
import type { SupplierFormValues } from '../../../../entities/supplier/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptySupplier: SupplierFormValues = {
  id: '',
  name: '',
  industry: null,
  website: null,
  description: null,
  annualRevenue: null,
  numberOfEmployees: null,
  supplierType: 'Other',
  supplierStatus: 'Pending',
  companyType: 'Tuzel',
  companyLegalType: null,
  taxOffice: null,
  vkn: null,
  mersisNo: null,
  contactPersonName: null,
  contactPersonEmail: null,
  contactPersonPhone: null,
  addressLine: null,
  city: null,
  country: null,
  postalCode: null,
  isActive: true,
};

export function SupplierDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.suppliers-detail');
  const { t: tEntity } = useTranslation('entity.supplier');
  const { t: tCommon } = useTranslation('common');

  const query = useSupplierQuery(id);
  const upsert = useUpsertSupplier();
  const deleteMutation = useDeleteSupplier();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="Supplier" entityId={id} />,
    },
    ...(mode === 'new' || !id
      ? []
      : [
          {
            key: 'activities',
            label: tCommon('tabs.activities'),
            content: (
              <RelatedActivitiesTab entityType="Supplier" entityId={id} />
            ),
          },
        ]),
  ];

  return (
    <DetailPageLayout<SupplierFormValues>
      mode={mode}
      title={title}
      schema={supplierSchema}
      defaultValues={emptySupplier}
      data={query.data as SupplierFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.SupplierView(saved.id)}
      tabs={tabs}
    >
      <GeneralSection />
      <CompanySection />
      <ContactSection />
      <AddressSection />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<SupplierFormValues>();
    return (
      <FormSection title={tEntity('sections.general')} collapsible="expanded">
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={200}
        />
        <FormRow>
          <TextField
            name="industry"
            control={form.control}
            label={tEntity('fields.industry.label')}
            placeholder={tEntity('fields.industry.placeholder')}
            maxLength={120}
          />
          <TextField
            name="website"
            control={form.control}
            label={tEntity('fields.website.label')}
            placeholder={tEntity('fields.website.placeholder')}
            maxLength={255}
          />
        </FormRow>
        <FormRow>
          <NumberField
            name="annualRevenue"
            control={form.control}
            label={tEntity('fields.annualRevenue.label')}
            min={0}
          />
          <NumberField
            name="numberOfEmployees"
            control={form.control}
            label={tEntity('fields.numberOfEmployees.label')}
            min={0}
          />
        </FormRow>
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          rows={3}
        />
      </FormSection>
    );
  }

  function CompanySection() {
    const form = useFormContext<SupplierFormValues>();
    // supplierType / supplierStatus / companyType / companyLegalType GeneralParameter'dan beslenir.
    const { options: supplierTypeOptions } = useGeneralParameters('SupplierType');
    const { options: supplierStatusOptions } = useGeneralParameters('SupplierStatus');
    const { options: companyTypeOptions } = useGeneralParameters('CompanyType');
    const { options: companyLegalTypeOptions } = useGeneralParameters('CompanyLegalType');
    return (
      <FormSection title={tEntity('sections.company')} collapsible="expanded">
        <FormRow>
          <SelectField
            name="supplierStatus"
            control={form.control}
            label={tEntity('fields.supplierStatus.label')}
            options={supplierStatusOptions}
          />
          <SelectField
            name="supplierType"
            control={form.control}
            label={tEntity('fields.supplierType.label')}
            options={supplierTypeOptions}
          />
        </FormRow>
        <FormRow>
          <SelectField
            name="companyType"
            control={form.control}
            label={tEntity('fields.companyType.label')}
            options={companyTypeOptions}
          />
          <SelectField
            name="companyLegalType"
            control={form.control}
            label={tEntity('fields.companyLegalType.label')}
            options={companyLegalTypeOptions}
            allowClear
          />
        </FormRow>
        <FormRow columns={4}>
          <TextField
            name="taxOffice"
            control={form.control}
            label={tEntity('fields.taxOffice.label')}
            maxLength={150}
            columns={2}
          />
          <TextField
            name="vkn"
            control={form.control}
            label={tEntity('fields.vkn.label')}
            maxLength={20}
          />
          <TextField
            name="mersisNo"
            control={form.control}
            label={tEntity('fields.mersisNo.label')}
            maxLength={20}
          />
        </FormRow>
      </FormSection>
    );
  }

  function ContactSection() {
    const form = useFormContext<SupplierFormValues>();
    return (
      <FormSection title={tEntity('sections.contact')} collapsible="expanded">
        <TextField
          name="contactPersonName"
          control={form.control}
          label={tEntity('fields.contactPersonName.label')}
          maxLength={150}
        />
        <TextField
          name="contactPersonEmail"
          control={form.control}
          label={tEntity('fields.contactPersonEmail.label')}
          maxLength={255}
        />
        <TextField
          name="contactPersonPhone"
          control={form.control}
          label={tEntity('fields.contactPersonPhone.label')}
          maxLength={50}
        />
      </FormSection>
    );
  }

  function AddressSection() {
    const form = useFormContext<SupplierFormValues>();
    return (
      <FormSection title={tEntity('sections.address')} collapsible="expanded">
        <TextField
          name="addressLine"
          control={form.control}
          label={tEntity('fields.addressLine.label')}
          maxLength={500}
        />
        <TextField
          name="city"
          control={form.control}
          label={tEntity('fields.city.label')}
          maxLength={120}
        />
        <TextField
          name="country"
          control={form.control}
          label={tEntity('fields.country.label')}
          maxLength={120}
        />
        <TextField
          name="postalCode"
          control={form.control}
          label={tEntity('fields.postalCode.label')}
          maxLength={20}
        />
      </FormSection>
    );
  }
}
