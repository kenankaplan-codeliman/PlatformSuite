import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  DetailPageLayout,
  FormSection,
  TextAreaField,
  TextField,
  useRouteMode,
} from '@platform/ui';
import { useEDocumentQuery } from '../../../../entities/edocument/api/useEDocumentQueries';
import { useDeleteEDocument, useUpsertEDocument } from '../../../../entities/edocument/api/useEDocumentMutations';
import { eDocumentSchema } from '../../../../entities/edocument/model/schema';
import type { EDocumentFormValues } from '../../../../entities/edocument/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const empty: EDocumentFormValues = {
  id: '',
  subject: '',
  description: null,
  documentType: 'Other',
  status: 'Draft',
  entityType: '',
  entityId: '',
  attachmentUrl: null,
  routingType: null,
  routingGroups: null,
  routingPersonIds: null,
  routingPersonNames: null,
};

export function EDocumentDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.edocuments-detail');
  const { t: tEntity } = useTranslation('entity.edocument');

  const query = useEDocumentQuery(id);
  const upsert = useUpsertEDocument();
  const del = useDeleteEDocument();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.subject ?? tPage('viewTitle');
  }, [mode, query.data?.subject, tPage]);

  return (
    <DetailPageLayout<EDocumentFormValues>
      mode={mode}
      title={title}
      schema={eDocumentSchema}
      defaultValues={empty}
      data={query.data as EDocumentFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => (await upsert.mutateAsync(values)).id}
      onDelete={id ? async () => { await del.mutateAsync(id); } : undefined}
      afterSaveNavigation={(saved) => RoutePaths.EDocumentView(saved.id)}
    >
      <General />
    </DetailPageLayout>
  );

  function General() {
    const form = useFormContext<EDocumentFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField name="subject" control={form.control} label={tEntity('fields.subject.label')} required maxLength={500} />
        <TextAreaField name="description" control={form.control} label={tEntity('fields.description.label')} rows={3} />
        <TextField name="documentType" control={form.control} label={tEntity('fields.documentType.label')} required />
        <TextField name="entityType" control={form.control} label={tEntity('fields.entityType.label')} required maxLength={100} />
        <TextField name="entityId" control={form.control} label={tEntity('fields.entityId.label')} required />
        <TextField name="attachmentUrl" control={form.control} label={tEntity('fields.attachmentUrl.label')} />
      </FormSection>
    );
  }
}
