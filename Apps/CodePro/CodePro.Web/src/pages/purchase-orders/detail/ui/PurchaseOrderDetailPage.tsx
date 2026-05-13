import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentPanel,
  DetailPageLayout,
  EntityLookupField,
  FormSection,
  RelatedActivitiesTab,
  ServicePath,
  TextAreaField,
  TextField,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import { usePurchaseOrderQuery } from '../../../../entities/purchase-order/api/usePurchaseOrderQueries';
import {
  useDeletePurchaseOrder,
  useUpsertPurchaseOrder,
} from '../../../../entities/purchase-order/api/usePurchaseOrderMutations';
import { purchaseOrderSchema } from '../../../../entities/purchase-order/model/schema';
import type { PurchaseOrderFormValues } from '../../../../entities/purchase-order/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const empty: PurchaseOrderFormValues = {
  id: '',
  orderNumber: '',
  title: '',
  description: null,
  supplierAccount: null,
  purchaseRequestId: null,
  status: 'Draft',
  priority: 'Medium',
  orderDate: new Date().toISOString(),
  expectedDeliveryDate: null,
  currencyCode: 'TRY',
  lines: [],
};

export function PurchaseOrderDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.purchase-orders-detail');
  const { t: tEntity } = useTranslation('entity.purchase-order');
  const { t: tCommon } = useTranslation('common');

  const query = usePurchaseOrderQuery(id);
  const upsert = useUpsertPurchaseOrder();
  const del = useDeletePurchaseOrder();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.title ?? tPage('viewTitle');
  }, [mode, query.data?.title, tPage]);

  const tabs: DetailPageTab[] | undefined =
    mode === 'new' || !id
      ? undefined
      : [
          {
            key: 'activities',
            label: tCommon('tabs.activities'),
            content: (
              <RelatedActivitiesTab entityType="PurchaseOrder" entityId={id} />
            ),
          },
        ];

  return (
    <DetailPageLayout<PurchaseOrderFormValues>
      mode={mode}
      title={title}
      schema={purchaseOrderSchema}
      defaultValues={empty}
      data={query.data as PurchaseOrderFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => { await upsert.mutateAsync(values); }}
      onDelete={id ? async () => { await del.mutateAsync(id); } : undefined}
      afterSaveNavigation={(saved) => RoutePaths.PurchaseOrderView(saved.id)}
      tabs={tabs}
    >
      <General />
      <AttachmentPanel entityType="PurchaseOrder" entityId={id} />
    </DetailPageLayout>
  );

  function General() {
    const form = useFormContext<PurchaseOrderFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField name="orderNumber" control={form.control} label={tEntity('fields.orderNumber.label')} maxLength={50} />
        <TextField name="title" control={form.control} label={tEntity('fields.title.label')} required maxLength={300} />
        <TextAreaField name="description" control={form.control} label={tEntity('fields.description.label')} rows={3} />
        <EntityLookupField
          name="supplierAccount"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          label={tEntity('fields.supplier.label')}
        />
        <TextField name="currencyCode" control={form.control} label={tEntity('fields.currencyCode.label')} maxLength={10} />
      </FormSection>
    );
  }
}
