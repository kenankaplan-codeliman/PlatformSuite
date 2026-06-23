import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSection,
  Button,
  DetailPageLayout,
  FormSection,
  SelectField,
  TextField,
  useFormMode,
  useRouteMode,
  type DetailPageTab,
  type SelectOption,
} from '@platform/ui';
import { useQuestionnaireQuery } from '../../../../entities/questionnaire/api/useQuestionnaireQueries';
import {
  useDeleteQuestionnaire,
  useUpsertQuestionnaire,
} from '../../../../entities/questionnaire/api/useQuestionnaireMutations';
import { questionnaireSchema } from '../../../../entities/questionnaire/model/schema';
import type {
  QuestionType,
  QuestionnaireFormValues,
  QuestionnaireRelatedModule,
  QuestionnaireStatus,
} from '../../../../entities/questionnaire/model/types';
import { RoutePaths } from '../../../../app/router/paths';

const RELATED_MODULES: QuestionnaireRelatedModule[] = ['Offer', 'Contract', 'Supplier', 'Order'];
const STATUSES: QuestionnaireStatus[] = ['Active', 'Passive', 'Draft'];
const QUESTION_TYPES: QuestionType[] = ['YesNo', 'ShortText', 'LongText', 'Number', 'Date', 'MultipleChoice'];

const emptyQuestionnaire: QuestionnaireFormValues = {
  id: '',
  name: '',
  relatedModule: 'Supplier',
  status: 'Draft',
  isActive: true,
  questions: [],
};

export function QuestionnaireDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation('page.questionnaires-detail');
  const { t: tEntity } = useTranslation('entity.questionnaire');
  const { t: tCommon } = useTranslation('common');

  const query = useQuestionnaireQuery(id);
  const upsert = useUpsertQuestionnaire();
  const deleteMutation = useDeleteQuestionnaire();

  const title = useMemo(() => {
    if (mode === 'new') return tPage('newTitle');
    if (mode === 'edit') return tPage('editTitle');
    return query.data?.name ?? tPage('viewTitle');
  }, [mode, query.data?.name, tPage]);

  const relatedModuleOptions: SelectOption<QuestionnaireRelatedModule>[] = RELATED_MODULES.map((value) => ({
    value,
    label: tEntity(`relatedModule.${value}`),
  }));

  const statusOptions: SelectOption<QuestionnaireStatus>[] = STATUSES.map((value) => ({
    value,
    label: tEntity(`status.${value}`),
  }));

  const tabs: DetailPageTab[] = [
    {
      key: 'attachments',
      label: tCommon('tabs.attachments'),
      content: <AttachmentSection entityType="Questionnaire" entityId={id} />,
    },
  ];

  return (
    <DetailPageLayout<QuestionnaireFormValues>
      mode={mode}
      title={title}
      schema={questionnaireSchema}
      defaultValues={emptyQuestionnaire}
      data={query.data as QuestionnaireFormValues | undefined}
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
      afterSaveNavigation={(saved) => RoutePaths.QuestionnaireView(saved.id)}
      tabs={tabs}
    >
      <GeneralSection
        relatedModuleOptions={relatedModuleOptions}
        statusOptions={statusOptions}
      />
      <QuestionsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    relatedModuleOptions,
    statusOptions,
  }: {
    relatedModuleOptions: SelectOption<QuestionnaireRelatedModule>[];
    statusOptions: SelectOption<QuestionnaireStatus>[];
  }) {
    const form = useFormContext<QuestionnaireFormValues>();
    return (
      <FormSection title={tEntity('sections.general')}>
        <TextField
          name="name"
          control={form.control}
          label={tEntity('fields.name.label')}
          placeholder={tEntity('fields.name.placeholder')}
          required
          maxLength={300}
        />
        <SelectField<QuestionnaireFormValues, QuestionnaireRelatedModule>
          name="relatedModule"
          control={form.control}
          label={tEntity('fields.relatedModule.label')}
          options={relatedModuleOptions}
          required
        />
        <SelectField<QuestionnaireFormValues, QuestionnaireStatus>
          name="status"
          control={form.control}
          label={tEntity('fields.status.label')}
          options={statusOptions}
          required
        />
      </FormSection>
    );
  }

  function QuestionsSection() {
    const form = useFormContext<QuestionnaireFormValues>();
    const { mode: formMode } = useFormMode();
    const isReadOnly = formMode === 'view';

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: 'questions',
    });

    const questionTypeOptions: SelectOption<QuestionType>[] = QUESTION_TYPES.map((value) => ({
      value,
      label: tEntity(`questionType.${value}`),
    }));

    return (
      <FormSection title={tEntity('sections.questions')}>
        {fields.map((field, index) => (
          <QuestionRow
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
            isReadOnly={isReadOnly}
            questionTypeOptions={questionTypeOptions}
          />
        ))}
        {!isReadOnly && (
          <Button
            htmlType="button"
            onClick={() =>
              append({
                id: '',
                questionText: '',
                questionType: 'ShortText',
                isRequired: false,
                orderIndex: fields.length,
                options: [],
              })
            }
          >
            {tEntity('actions.addQuestion')}
          </Button>
        )}
      </FormSection>
    );
  }

  function QuestionRow({
    index,
    onRemove,
    isReadOnly,
    questionTypeOptions,
  }: {
    index: number;
    onRemove: () => void;
    isReadOnly: boolean;
    questionTypeOptions: SelectOption<QuestionType>[];
  }) {
    const form = useFormContext<QuestionnaireFormValues>();
    const questionType = form.watch(`questions.${index}.questionType`);
    const showOptions = questionType === 'MultipleChoice';

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: `questions.${index}.options` as const,
    });

    return (
      <div style={{ border: '1px solid #eee', padding: 12, marginBottom: 12, borderRadius: 4 }}>
        <TextField
          name={`questions.${index}.questionText` as const}
          control={form.control}
          label={tEntity('fields.questionText.label')}
          placeholder={tEntity('fields.questionText.placeholder')}
          required
          maxLength={1000}
        />
        <SelectField<QuestionnaireFormValues, QuestionType>
          name={`questions.${index}.questionType` as const}
          control={form.control}
          label={tEntity('fields.questionType.label')}
          options={questionTypeOptions}
          required
        />
        {showOptions && (
          <div style={{ marginLeft: 16 }}>
            <strong>{tEntity('fields.options.label')}</strong>
            {fields.map((opt, optIndex) => (
              <div key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <TextField
                    name={`questions.${index}.options.${optIndex}.optionText` as const}
                    control={form.control}
                    label={tEntity('fields.optionText.label')}
                    placeholder={tEntity('fields.optionText.placeholder')}
                    required
                    maxLength={500}
                  />
                </div>
                {!isReadOnly && (
                  <Button htmlType="button" onClick={() => remove(optIndex)}>
                    {tEntity('actions.removeOption')}
                  </Button>
                )}
              </div>
            ))}
            {!isReadOnly && (
              <Button
                htmlType="button"
                onClick={() =>
                  append({
                    id: '',
                    optionText: '',
                    orderIndex: fields.length,
                  })
                }
              >
                {tEntity('actions.addOption')}
              </Button>
            )}
          </div>
        )}
        {!isReadOnly && (
          <Button htmlType="button" onClick={onRemove}>
            {tEntity('actions.removeQuestion')}
          </Button>
        )}
      </div>
    );
  }
}
