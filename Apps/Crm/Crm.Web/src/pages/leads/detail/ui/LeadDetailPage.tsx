import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  DetailPageLayout,
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
} from '@platform/ui';
import { CrmServicePath } from '../../../../shared/api/servicePaths';
import { useLeadQuery } from '../../../../entities/lead/api/useLeadQueries';
import {
  useDeleteLead,
  useUpsertLead,
} from '../../../../entities/lead/api/useLeadMutations';
import { leadSchema } from '../../../../entities/lead/model/schema';
import type { LeadFormValues } from '../../../../entities/lead/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyLead: LeadFormValues = {
  id: '',
  subject: '',
  firstName: null,
  lastName: null,
  company: null,
  title: null,
  email: null,
  phone: null,
  website: null,
  source: 'Other',
  status: 'New',
  score: null,
  estimatedValue: null,
  description: null,
  convertedAccountId: null,
  convertedContactId: null,
  isActive: true,
};

export function LeadDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.leads-detail');
  const { t: tEntity } = useTranslation('entity.lead');
  const { t: tCommon } = useTranslation('common');

  const query = useLeadQuery(id);
  const upsert = useUpsertLead();
  const deleteMutation = useDeleteLead();

  // source / status GeneralParameter'dan beslenir — statik enum yok.
  const { options: statusOptions } = useGeneralParameters('LeadStatus');
  const { options: sourceOptions } = useGeneralParameters('LeadSource');

  // Sahip atama + Aktif/Pasif: ayrı action endpoint'leri (save'e dahil değil),
  // kendi privilege'larıyla; başarıda footer + detail query tazelenir.
  const ownerAssign = useOwnerAssignAction({
    entityId: id,
    entityType: 'Lead',
    servicePath: CrmServicePath.Lead.Assign,
  });
  const stateToggle = useSetStateAction({
    entityId: id,
    entityType: 'Lead',
    servicePath: CrmServicePath.Lead.SetState,
    isActive: query.data?.isActive ?? true,
    onSuccess: () => {
      void query.refetch();
    },
  });
  const extraActions = [ownerAssign.action, stateToggle.action].filter(
    (a): a is DetailPageAction => a !== null,
  );

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.subject ?? tPage('viewTitle');
  }, [mode, query.data?.subject, tPage]);

  const tabs: DetailPageTab[] | undefined =
    mode === 'new' || !id
      ? undefined
      : [
          {
            key: 'activities',
            label: tCommon('tabs.activities'),
            content: <RelatedActivitiesTab entityType="Lead" entityId={id} />,
          },
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
      <GeneralSection sourceOptions={sourceOptions} statusOptions={statusOptions} />
      <ContactSection />
      <DetailsSection />
      <AttachmentSection entityType="Lead" entityId={id} />
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
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="subject"
          control={form.control}
          label={tEntity('fields.subject.label')}
          placeholder={tEntity('fields.subject.placeholder')}
          required
          maxLength={250}
        />
        <SelectField<LeadFormValues>
          name="status"
          control={form.control}
          label={tEntity('fields.status.label')}
          options={statusOptions}
          required
        />
        <SelectField<LeadFormValues>
          name="source"
          control={form.control}
          label={tEntity('fields.source.label')}
          options={sourceOptions}
          required
        />
        <NumberField
          name="score"
          control={form.control}
          label={tEntity('fields.score.label')}
          min={0}
          max={100}
        />
        <NumberField
          name="estimatedValue"
          control={form.control}
          label={tEntity('fields.estimatedValue.label')}
          min={0}
          precision={2}
        />
      </FormSection>
    );
  }

  function ContactSection() {
    const form = useFormContext<LeadFormValues>();
    return (
      <FormSection title={tEntity('sections.contact')}>
        <TextField
          name="firstName"
          control={form.control}
          label={tEntity('fields.firstName.label')}
          maxLength={100}
        />
        <TextField
          name="lastName"
          control={form.control}
          label={tEntity('fields.lastName.label')}
          maxLength={100}
        />
        <TextField
          name="company"
          control={form.control}
          label={tEntity('fields.company.label')}
          maxLength={250}
        />
        <TextField
          name="title"
          control={form.control}
          label={tEntity('fields.title.label')}
          maxLength={150}
        />
        <TextField
          name="email"
          control={form.control}
          label={tEntity('fields.email.label')}
          maxLength={250}
        />
        <TextField
          name="phone"
          control={form.control}
          label={tEntity('fields.phone.label')}
          maxLength={50}
        />
        <TextField
          name="website"
          control={form.control}
          label={tEntity('fields.website.label')}
          maxLength={250}
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<LeadFormValues>();
    return (
      <FormSection title={tEntity('sections.details')}>
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          rows={4}
        />
      </FormSection>
    );
  }
}
