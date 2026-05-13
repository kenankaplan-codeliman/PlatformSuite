import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel, SelectField } from '@platform/ui';
import type { QuestionnaireListFilter } from '../../../../entities/questionnaire/model/types';
import {
  QUESTIONNAIRE_RELATED_MODULES,
  QUESTIONNAIRE_STATUSES,
  questionnaireListFilterDefaults,
  questionnaireListFilterSchema,
} from '../../../../entities/questionnaire/model/listFilterSchema';

export interface QuestionnairesFilterPanelProps {
  values: QuestionnaireListFilter;
  onApply: (next: QuestionnaireListFilter) => void;
  onClear: () => void;
}

export function QuestionnairesFilterPanel({
  values,
  onApply,
  onClear,
}: QuestionnairesFilterPanelProps) {
  const { t: tEntity } = useTranslation('entity.questionnaire');

  return (
    <FilterPanel<QuestionnaireListFilter>
      values={values}
      defaultValues={questionnaireListFilterDefaults}
      schema={questionnaireListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'name',
        placeholder: tEntity('fields.name.placeholder'),
      }}
    >
      <QuestionnaireFilterFields />
    </FilterPanel>
  );
}

function QuestionnaireFilterFields() {
  const { t: tEntity } = useTranslation('entity.questionnaire');
  const { t: tCommon } = useTranslation('common');
  const { control } = useFormContext<QuestionnaireListFilter>();

  return (
    <>
      <SelectField
        name="relatedModule"
        control={control}
        label={tEntity('fields.relatedModule.label')}
        options={QUESTIONNAIRE_RELATED_MODULES.map((v) => ({
          value: v,
          label: tEntity(`relatedModule.${v}`),
        }))}
        allowClear
      />
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={QUESTIONNAIRE_STATUSES.map((v) => ({
          value: v,
          label: tEntity(`status.${v}`),
        }))}
        allowClear
      />
      <SelectField<QuestionnaireListFilter, boolean>
        name="isActive"
        control={control}
        label={tEntity('fields.isActive.label')}
        options={[
          { value: true, label: tCommon('filters.activeOnly') },
          { value: false, label: tCommon('filters.inactiveOnly') },
        ]}
        allowClear
      />
    </>
  );
}
