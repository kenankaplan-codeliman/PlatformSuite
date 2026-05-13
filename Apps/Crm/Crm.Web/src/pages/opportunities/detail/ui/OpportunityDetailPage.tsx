import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  DateTimeField,
  DetailPageLayout,
  EntityLookupField,
  FormSection,
  NumberField,
  RelatedActivitiesTab,
  SelectField,
  ServicePath,
  TextAreaField,
  TextField,
  useRouteMode,
  type DetailPageTab,
  type SelectOption,
} from '@platform/ui';
import { useOpportunityQuery } from '../../../../entities/opportunity/api/useOpportunityQueries';
import {
  useDeleteOpportunity,
  useUpsertOpportunity,
} from '../../../../entities/opportunity/api/useOpportunityMutations';
import { opportunitySchema } from '../../../../entities/opportunity/model/schema';
import type {
  OpportunityFormValues,
  OpportunityStage,
} from '../../../../entities/opportunity/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const OPPORTUNITY_STAGES: OpportunityStage[] = [
  'Prospecting',
  'Qualification',
  'NeedsAnalysis',
  'Proposal',
  'Negotiation',
  'ClosedWon',
  'ClosedLost',
];

const emptyOpportunity: OpportunityFormValues = {
  id: '',
  name: '',
  description: null,
  account: null,
  primaryContact: null,
  stage: 'Prospecting',
  amount: null,
  probability: 0,
  closeDate: null,
  lossReason: null,
  isActive: true,
};

export function OpportunityDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.opportunities-detail');
  const { t: tEntity } = useTranslation('entity.opportunity');
  const { t: tEnums } = useTranslation('enums');
  const { t: tCommon } = useTranslation('common');

  const query = useOpportunityQuery(id);
  const upsert = useUpsertOpportunity();
  const deleteMutation = useDeleteOpportunity();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const stageOptions: SelectOption<OpportunityStage>[] = OPPORTUNITY_STAGES.map((value) => ({
    value,
    label: tEnums(`opportunityStage.${value}`),
  }));

  const tabs: DetailPageTab[] | undefined =
    mode === 'new' || !id
      ? undefined
      : [
          {
            key: 'activities',
            label: tCommon('tabs.activities'),
            content: (
              <RelatedActivitiesTab entityType="Opportunity" entityId={id} />
            ),
          },
        ];

  return (
    <DetailPageLayout<OpportunityFormValues>
      mode={mode}
      title={title}
      schema={opportunitySchema}
      defaultValues={emptyOpportunity}
      data={query.data as OpportunityFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.OpportunityView(saved.id)}
      tabs={tabs}
    >
      <GeneralSection stageOptions={stageOptions} />
      <FinancialSection />
      <DetailsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    stageOptions,
  }: {
    stageOptions: SelectOption<OpportunityStage>[];
  }) {
    const form = useFormContext<OpportunityFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={250}
        />
        <EntityLookupField
          name="account"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          label={tEntity('fields.account.label')}
        />
        <EntityLookupField
          name="primaryContact"
          control={form.control}
          servicePath={ServicePath.Contact.Search}
          label={tEntity('fields.primaryContact.label')}
          allowClear
        />
        <SelectField<OpportunityFormValues, OpportunityStage>
          name="stage"
          control={form.control}
          label={tEntity('fields.stage.label')}
          options={stageOptions}
          required
        />
      </FormSection>
    );
  }

  function FinancialSection() {
    const form = useFormContext<OpportunityFormValues>();
    return (
      <FormSection title={tEntity('sections.financial')}>
        <NumberField
          name="amount"
          control={form.control}
          label={tEntity('fields.amount.label')}
          min={0}
          precision={2}
        />
        <NumberField
          name="probability"
          control={form.control}
          label={tEntity('fields.probability.label')}
          min={0}
          max={100}
          required
        />
        <DateTimeField
          name="closeDate"
          control={form.control}
          label={tEntity('fields.closeDate.label')}
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<OpportunityFormValues>();
    return (
      <FormSection title={tEntity('sections.details')}>
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          rows={4}
        />
        <TextField
          name="lossReason"
          control={form.control}
          label={tEntity('fields.lossReason.label')}
          maxLength={500}
        />
      </FormSection>
    );
  }
}
