import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  DetailPageLayout,
  FormSection,
  NumberField,
  RelatedActivitiesTab,
  TextAreaField,
  TextField,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import { useBudgetQuery } from '../../../../entities/budget/api/useBudgetQueries';
import { useDeleteBudget, useUpsertBudget } from '../../../../entities/budget/api/useBudgetMutations';
import { budgetSchema } from '../../../../entities/budget/model/schema';
import type { BudgetFormValues } from '../../../../entities/budget/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const empty: BudgetFormValues = {
  id: '',
  name: '',
  description: null,
  scopeOrganizationId: null,
  budgetCategoryId: null,
  periodType: 'Yearly',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  totalAmount: 0,
  currency: 'TRY',
  overflowBehavior: 'Block',
  reservationReleasePoint: 'PurchaseOrder',
  alertThresholdPercentage: 80,
  carryOverEnabled: false,
  responsibleUserId: '',
  status: 'Draft',
};

export function BudgetDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.budgets-detail');
  const { t: tEntity } = useTranslation('entity.budget');
  const { t: tCommon } = useTranslation('common');

  const query = useBudgetQuery(id);
  const upsert = useUpsertBudget();
  const del = useDeleteBudget();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="Budget" entityId={id} />,
    },
    ...(mode === 'new' || !id
      ? []
      : [
          {
            key: 'activities',
            label: tCommon('tabs.activities'),
            content: <RelatedActivitiesTab entityType="Budget" entityId={id} />,
          },
        ]),
  ];

  return (
    <DetailPageLayout<BudgetFormValues>
      mode={mode}
      title={title}
      schema={budgetSchema}
      defaultValues={empty}
      data={query.data as BudgetFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => (await upsert.mutateAsync(values)).id}
      onDelete={id ? async () => { await del.mutateAsync(id); } : undefined}
      afterSaveNavigation={(saved) => RoutePaths.BudgetView(saved.id)}
      tabs={tabs}
    >
      <General />
    </DetailPageLayout>
  );

  function General() {
    const form = useFormContext<BudgetFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField name="name" control={form.control} label={tEntity('fields.name.label')} required maxLength={300} />
        <TextAreaField name="description" control={form.control} label={tEntity('fields.description.label')} rows={3} />
        <NumberField name="totalAmount" control={form.control} label={tEntity('fields.totalAmount.label')} min={0} />
        <TextField name="currency" control={form.control} label={tEntity('fields.currency.label')} required maxLength={10} />
        <NumberField name="alertThresholdPercentage" control={form.control} label={tEntity('fields.alertThresholdPercentage.label')} min={0} max={100} />
      </FormSection>
    );
  }
}
