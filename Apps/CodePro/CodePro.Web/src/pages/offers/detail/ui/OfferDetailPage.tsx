import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentPanel,
  DetailPageLayout,
  FormSection,
  NumberField,
  RelatedActivitiesTab,
  TextAreaField,
  TextField,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import { useOfferQuery } from '../../../../entities/offer/api/useOfferQueries';
import { useDeleteOffer, useUpsertOffer } from '../../../../entities/offer/api/useOfferMutations';
import { offerSchema } from '../../../../entities/offer/model/schema';
import type { OfferFormValues } from '../../../../entities/offer/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const empty: OfferFormValues = {
  id: '',
  offerNumber: '',
  offerType: 'Sales',
  subject: '',
  counterpartyName: '',
  counterpartyId: null,
  responsibleUserId: '',
  validFrom: null,
  validUntil: new Date().toISOString().slice(0, 10),
  currency: 'TRY',
  discountPercentage: 0,
  notes: null,
  status: 'Draft',
  items: [],
};

export function OfferDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.offers-detail');
  const { t: tEntity } = useTranslation('entity.offer');
  const { t: tCommon } = useTranslation('common');

  const query = useOfferQuery(id);
  const upsert = useUpsertOffer();
  const del = useDeleteOffer();

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
            content: <RelatedActivitiesTab entityType="Offer" entityId={id} />,
          },
        ];

  return (
    <DetailPageLayout<OfferFormValues>
      mode={mode}
      title={title}
      schema={offerSchema}
      defaultValues={empty}
      data={query.data as OfferFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => { await upsert.mutateAsync(values); }}
      onDelete={id ? async () => { await del.mutateAsync(id); } : undefined}
      afterSaveNavigation={(saved) => RoutePaths.OfferView(saved.id)}
      tabs={tabs}
    >
      <General />
      <AttachmentPanel entityType="Offer" entityId={id} />
    </DetailPageLayout>
  );

  function General() {
    const form = useFormContext<OfferFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField name="offerNumber" control={form.control} label={tEntity('fields.offerNumber.label')} required maxLength={50} />
        <TextField name="subject" control={form.control} label={tEntity('fields.subject.label')} required maxLength={500} />
        <TextField name="counterpartyName" control={form.control} label={tEntity('fields.counterpartyName.label')} required maxLength={300} />
        <TextField name="currency" control={form.control} label={tEntity('fields.currency.label')} required maxLength={10} />
        <NumberField name="discountPercentage" control={form.control} label={tEntity('fields.discountPercentage.label')} min={0} max={100} />
        <TextAreaField name="notes" control={form.control} label={tEntity('fields.notes.label')} rows={3} />
      </FormSection>
    );
  }
}
