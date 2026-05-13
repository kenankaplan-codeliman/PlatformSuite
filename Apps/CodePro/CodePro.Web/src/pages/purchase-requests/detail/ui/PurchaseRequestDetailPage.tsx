import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  DetailPageLayout,
  FormSection,
  TextAreaField,
  TextField,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import { usePurchaseRequestQuery } from '../../../../entities/purchase-request/api/usePurchaseRequestQueries';
import {
  useDeletePurchaseRequest,
  useUpsertPurchaseRequest,
} from '../../../../entities/purchase-request/api/usePurchaseRequestMutations';
import { purchaseRequestSchema } from '../../../../entities/purchase-request/model/schema';
import type { PurchaseRequestFormValues } from '../../../../entities/purchase-request/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const empty: PurchaseRequestFormValues = {
  id: '',
  requestNumber: '',
  title: '',
  description: null,
  status: 'Setup',
  priority: 'Medium',
  requestDate: new Date().toISOString(),
  requiredDate: null,
  currencyCode: 'TRY',
  lines: [],
};

export function PurchaseRequestDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.purchase-requests-detail');
  const { t: tEntity } = useTranslation('entity.purchase-request');
  const { t: tCommon } = useTranslation('common');

  const query = usePurchaseRequestQuery(id);
  const upsert = useUpsertPurchaseRequest();
  const del = useDeletePurchaseRequest();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.title ?? tPage('viewTitle');
  }, [mode, query.data?.title, tPage]);

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="PurchaseRequest" entityId={id} />,
    },
  ];

  return (
    <DetailPageLayout<PurchaseRequestFormValues>
      mode={mode}
      title={title}
      schema={purchaseRequestSchema}
      defaultValues={empty}
      data={query.data as PurchaseRequestFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => { await upsert.mutateAsync(values); }}
      onDelete={id ? async () => { await del.mutateAsync(id); } : undefined}
      afterSaveNavigation={(saved) => RoutePaths.PurchaseRequestView(saved.id)}
      tabs={tabs}
    >
      <General />
    </DetailPageLayout>
  );

  function General() {
    const form = useFormContext<PurchaseRequestFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField name="requestNumber" control={form.control} label={tEntity('fields.requestNumber.label')} maxLength={50} />
        <TextField name="title" control={form.control} label={tEntity('fields.title.label')} required maxLength={300} />
        <TextAreaField name="description" control={form.control} label={tEntity('fields.description.label')} rows={3} />
        <TextField name="currencyCode" control={form.control} label={tEntity('fields.currencyCode.label')} maxLength={10} />
      </FormSection>
    );
  }
}
