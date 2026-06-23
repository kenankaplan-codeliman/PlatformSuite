import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  DetailPageLayout,
  FormSection,
  SelectField,
  TextAreaField,
  TextField,
  useRouteMode,
  type DetailPageTab,
} from '@platform/ui';
import {
  useBudgetCategoryListQuery,
  useBudgetCategoryQuery,
} from '../../../../entities/budget-category/api/useBudgetCategoryQueries';
import {
  useDeleteBudgetCategory,
  useUpsertBudgetCategory,
} from '../../../../entities/budget-category/api/useBudgetCategoryMutations';
import { budgetCategorySchema } from '../../../../entities/budget-category/model/schema';
import type { BudgetCategoryFormValues } from '../../../../entities/budget-category/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const emptyBudgetCategory: BudgetCategoryFormValues = {
  id: '',
  name: '',
  code: null,
  description: null,
  parentCategoryId: null,
  isActive: true,
};

export function BudgetCategoryDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.budget-categories-detail');
  const { t: tEntity } = useTranslation('entity.budget-category');
  const { t: tCommon } = useTranslation('common');

  const query = useBudgetCategoryQuery(id);
  const upsert = useUpsertBudgetCategory();
  const deleteMutation = useDeleteBudgetCategory();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="BudgetCategory" entityId={id} />,
    },
  ];

  return (
    <DetailPageLayout<BudgetCategoryFormValues>
      mode={mode}
      title={title}
      schema={budgetCategorySchema}
      defaultValues={emptyBudgetCategory}
      data={query.data as BudgetCategoryFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.BudgetCategoryView(saved.id)}
      tabs={tabs}
    >
      <GeneralSection currentId={id} />
    </DetailPageLayout>
  );

  function GeneralSection({ currentId }: { currentId: string | undefined }) {
    const form = useFormContext<BudgetCategoryFormValues>();
    const parentListQuery = useBudgetCategoryListQuery({
      pageSize: 200,
      filters: { isActive: true },
    });

    const parentOptions = useMemo(() => {
      const items = parentListQuery.data?.pages.flatMap((p) => p.data) ?? [];
      return items
        .filter((c) => c.id !== currentId)
        .map((c) => ({ value: c.id, label: c.name }));
    }, [parentListQuery.data, currentId]);

    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={200}
        />
        <TextField
          name="code"
          control={form.control}
          label={tEntity('fields.code.label')}
          placeholder={tEntity('fields.code.placeholder')}
          maxLength={50}
        />
        <SelectField
          name="parentCategoryId"
          control={form.control}
          options={parentOptions}
          label={tEntity('fields.parentCategoryId.label')}
          placeholder={tEntity('fields.parentCategoryId.placeholder')}
          allowClear
        />
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity('fields.description.label')}
          placeholder={tEntity('fields.description.placeholder')}
          maxLength={1000}
          rows={3}
        />
      </FormSection>
    );
  }
}
