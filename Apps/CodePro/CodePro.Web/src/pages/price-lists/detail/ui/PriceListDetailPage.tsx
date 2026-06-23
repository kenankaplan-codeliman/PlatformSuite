import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  DetailPageLayout,
  EntityLookupField,
  FormSection,
  ServicePath,
  TextAreaField,
  TextField,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import { usePriceListQuery } from '../../../../entities/price-list/api/usePriceListQueries';
import {
  useDeletePriceList,
  useUpsertPriceList,
} from '../../../../entities/price-list/api/usePriceListMutations';
import { priceListSchema } from '../../../../entities/price-list/model/schema';
import type { PriceListFormValues } from '../../../../entities/price-list/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyPriceList: PriceListFormValues = {
  id: '',
  code: '',
  name: '',
  description: null,
  supplierAccount: null,
  isActive: true,
};

export function PriceListDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.price-lists-detail');
  const { t: tEntity } = useTranslation('entity.price-list');
  const { t: tCommon } = useTranslation('common');

  const query = usePriceListQuery(id);
  const upsert = useUpsertPriceList();
  const deleteMutation = useDeletePriceList();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="PriceList" entityId={id} />,
    },
  ];

  return (
    <DetailPageLayout<PriceListFormValues>
      mode={mode}
      title={title}
      schema={priceListSchema}
      defaultValues={emptyPriceList}
      data={query.data as PriceListFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => (await upsert.mutateAsync(values)).id}
      onDelete={
        id
          ? async () => {
              await deleteMutation.mutateAsync(id);
            }
          : undefined
      }
      afterSaveNavigation={(saved) => RoutePaths.PriceListView(saved.id)}
      tabs={tabs}
    >
      <GeneralSection />
    </DetailPageLayout>
  );

  function GeneralSection() {
    const form = useFormContext<PriceListFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="code"
          control={form.control}
          label={tEntity('fields.code.label')}
          placeholder={tEntity('fields.code.placeholder')}
          maxLength={50}
        />
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={200}
        />
        <EntityLookupField
          name="supplierAccount"
          control={form.control}
          servicePath={ServicePath.Account.Search}
          label={tEntity('fields.supplier.label')}
          placeholder={tEntity('fields.supplier.placeholder')}
        />
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          placeholder={tEntity('fields.description.placeholder')}
          rows={3}
          maxLength={1000}
        />
      </FormSection>
    );
  }
}
