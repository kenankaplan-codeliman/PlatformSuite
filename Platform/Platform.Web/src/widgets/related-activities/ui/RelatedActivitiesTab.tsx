import { ActivityListView } from '../../activity-list/ui/ActivityListView';

export interface RelatedActivitiesTabProps {
  entityType: string;
  entityId: string;
}

export function RelatedActivitiesTab({
  entityType,
  entityId,
}: RelatedActivitiesTabProps) {
  return (
    <ActivityListView
      filters={{
        regardingEntityType: entityType,
        regardingEntityId: entityId,
      }}
    />
  );
}
