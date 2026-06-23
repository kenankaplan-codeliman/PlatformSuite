import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DetailPageLayout, FormSection, useRouteMode } from '@platform/ui';
import { usePurchaseBasketQuery } from '../../../../entities/purchase-basket/api/usePurchaseBasketQueries';
import {
  useDeletePurchaseBasket,
  useUpsertPurchaseBasket,
} from '../../../../entities/purchase-basket/api/usePurchaseBasketMutations';
import { purchaseBasketSchema } from '../../../../entities/purchase-basket/model/schema';
import type { PurchaseBasketFormValues } from '../../../../entities/purchase-basket/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const empty: PurchaseBasketFormValues = {
  id: '',
  status: 'Preparing',
  purchaseRequestId: null,
  lines: [],
};

export function PurchaseBasketDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.purchase-baskets-detail');
  const { t: tEntity } = useTranslation('entity.purchase-basket');

  const query = usePurchaseBasketQuery(id);
  const upsert = useUpsertPurchaseBasket();
  const del = useDeletePurchaseBasket();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return tPage('viewTitle');
  }, [mode, tPage]);

  return (
    <DetailPageLayout<PurchaseBasketFormValues>
      mode={mode}
      title={title}
      schema={purchaseBasketSchema}
      defaultValues={empty}
      data={query.data as PurchaseBasketFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => (await upsert.mutateAsync(values)).id}
      onDelete={id ? async () => { await del.mutateAsync(id); } : undefined}
      afterSaveNavigation={(saved) => RoutePaths.PurchaseBasketView(saved.id)}
    >
      <FormSection title={tEntity('sections.general')}>
        <div>{tEntity('fields.status.label')}: {query.data?.status ?? '-'}</div>
        <div>{tEntity('fields.lineCount.label')}: {query.data?.lines?.length ?? 0}</div>
      </FormSection>
    </DetailPageLayout>
  );
}
