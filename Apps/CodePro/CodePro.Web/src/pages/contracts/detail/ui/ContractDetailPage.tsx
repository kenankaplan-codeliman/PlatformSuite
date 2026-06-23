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
import { useContractQuery } from '../../../../entities/contract/api/useContractQueries';
import { useDeleteContract, useUpsertContract } from '../../../../entities/contract/api/useContractMutations';
import { contractSchema } from '../../../../entities/contract/model/schema';
import type { ContractFormValues } from '../../../../entities/contract/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const empty: ContractFormValues = {
  id: '',
  contractNumber: '',
  subject: '',
  type: 'Sales',
  counterpartyName: '',
  counterpartyId: null,
  relatedOfferId: null,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: null,
  renewalType: 'None',
  amount: null,
  currency: 'TRY',
  paymentType: null,
  responsibleUserId: '',
  additionalResponsibleUserIds: null,
  reminderDaysBefore: 30,
  notes: null,
  status: 'Draft',
};

export function ContractDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.contracts-detail');
  const { t: tEntity } = useTranslation('entity.contract');
  const { t: tCommon } = useTranslation('common');

  const query = useContractQuery(id);
  const upsert = useUpsertContract();
  const del = useDeleteContract();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.subject ?? tPage('viewTitle');
  }, [mode, query.data?.subject, tPage]);

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="Contract" entityId={id} />,
    },
    ...(mode === 'new' || !id
      ? []
      : [
          {
            key: 'activities',
            label: tCommon('tabs.activities'),
            content: (
              <RelatedActivitiesTab entityType="Contract" entityId={id} />
            ),
          },
        ]),
  ];

  return (
    <DetailPageLayout<ContractFormValues>
      mode={mode}
      title={title}
      schema={contractSchema}
      defaultValues={empty}
      data={query.data as ContractFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => (await upsert.mutateAsync(values)).id}
      onDelete={id ? async () => { await del.mutateAsync(id); } : undefined}
      afterSaveNavigation={(saved) => RoutePaths.ContractView(saved.id)}
      tabs={tabs}
    >
      <General />
    </DetailPageLayout>
  );

  function General() {
    const form = useFormContext<ContractFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField name="contractNumber" control={form.control} label={tEntity('fields.contractNumber.label')} required maxLength={50} />
        <TextField name="subject" control={form.control} label={tEntity('fields.subject.label')} required maxLength={500} />
        <TextField name="counterpartyName" control={form.control} label={tEntity('fields.counterpartyName.label')} required maxLength={300} />
        <NumberField name="amount" control={form.control} label={tEntity('fields.amount.label')} />
        <NumberField name="reminderDaysBefore" control={form.control} label={tEntity('fields.reminderDaysBefore.label')} min={0} />
        <TextAreaField name="notes" control={form.control} label={tEntity('fields.notes.label')} rows={3} />
      </FormSection>
    );
  }
}
