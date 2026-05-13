import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { FilterPanel } from '../../../../shared/ui/list-page/FilterPanel';
import { DateTimeField } from '../../../../shared/ui/form/fields/DateTimeField';
import { SelectField } from '../../../../shared/ui/form/fields/SelectField';
import { useEnumTranslation } from '../../../../shared/lib/i18n/enum';
import { enumToOptions } from '../../../../shared/lib/options/enumToOptions';
import type { ActivityListFilter } from '../../../../entities/activity/model/types';
import {
  ACTIVITY_PRIORITIES_LIST,
  ACTIVITY_STATUSES_LIST,
  ACTIVITY_TYPES_LIST,
  activityListFilterDefaults,
  activityListFilterSchema,
} from '../../../../entities/activity/model/listFilterSchema';

export interface ActivitiesFilterPanelProps {
  values: ActivityListFilter;
  onApply: (next: ActivityListFilter) => void;
  onClear: () => void;
}

export function ActivitiesFilterPanel({ values, onApply, onClear }: ActivitiesFilterPanelProps) {
  const { t: tPage } = useTranslation('page.activities-list');

  return (
    <FilterPanel<ActivityListFilter>
      values={values}
      defaultValues={activityListFilterDefaults}
      schema={activityListFilterSchema}
      onApply={onApply}
      onClear={onClear}
      searchField={{
        name: 'subject',
        placeholder: tPage('filters.searchPlaceholder'),
      }}
    >
      <ActivityFilterFields />
    </FilterPanel>
  );
}

function ActivityFilterFields() {
  const { t: tEntity } = useTranslation('entity.activity');
  const { t: tPage } = useTranslation('page.activities-list');
  const { t: tCommon } = useTranslation('common');
  const tType = useEnumTranslation('activityType');
  const tStatus = useEnumTranslation('activityStatus');
  const tPriority = useEnumTranslation('activityPriority');
  const { control } = useFormContext<ActivityListFilter>();

  return (
    <>
      <SelectField
        name="activityType"
        control={control}
        label={tEntity('fields.activityType.label')}
        options={enumToOptions(ACTIVITY_TYPES_LIST, tType)}
        allowClear
      />
      <SelectField
        name="status"
        control={control}
        label={tEntity('fields.status.label')}
        options={enumToOptions(ACTIVITY_STATUSES_LIST, tStatus)}
        allowClear
      />
      <SelectField
        name="priority"
        control={control}
        label={tEntity('fields.priority.label')}
        options={enumToOptions(ACTIVITY_PRIORITIES_LIST, tPriority)}
        allowClear
      />
      <DateTimeField
        name="dueDateFrom"
        control={control}
        label={tPage('filters.dueDateFrom')}
      />
      <DateTimeField
        name="dueDateTo"
        control={control}
        label={tPage('filters.dueDateTo')}
      />
      <SelectField<ActivityListFilter, boolean>
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
