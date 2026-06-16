import { useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';
import type { ComponentType } from 'react';
import type { DashboardComponentMap, DashboardWidgetMeta, DashboardWidgetProps } from '../model/contracts';

interface DashboardGridProps {
  catalog: readonly DashboardWidgetMeta[];
  components: DashboardComponentMap;
  visibleKeys: string[];
  isCustomizing: boolean;
  ownerScopes: Record<string, boolean>;
  onReorder: (order: string[]) => void;
  onOwnerOnlyChange: (key: string, ownerOnly: boolean) => void;
}

interface SortableWidgetProps {
  widgetKey: string;
  span: number;
  Component: ComponentType<DashboardWidgetProps>;
  isCustomizing: boolean;
  ownerOnly: boolean;
  onOwnerOnlyChange: (key: string, ownerOnly: boolean) => void;
}

function SortableWidget({
  widgetKey,
  span,
  Component,
  isCustomizing,
  ownerOnly,
  onOwnerOnlyChange,
}: SortableWidgetProps) {
  const { t } = useTranslation('widget.dashboard');
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: widgetKey, disabled: !isCustomizing });

  const style: CSSProperties = {
    gridColumn: `span ${span}`,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {isCustomizing && (
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 24,
            marginBottom: 6,
            borderRadius: 6,
            background: 'rgba(22,119,255,0.08)',
            color: '#1677ff',
            cursor: isDragging ? 'grabbing' : 'grab',
            fontSize: 12,
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          <HolderOutlined />
          <span>{t('dragHandle')}</span>
        </div>
      )}
      <Component ownerOnly={ownerOnly} onOwnerOnlyChange={(v) => onOwnerOnlyChange(widgetKey, v)} />
    </div>
  );
}

/** Görünür widget'ları 12 sütunluk grid'de render eder; özelleştirme modunda dnd-kit ile sürükle-sırala. */
export function DashboardGrid({
  catalog,
  components,
  visibleKeys,
  isCustomizing,
  ownerScopes,
  onReorder,
  onOwnerOnlyChange,
}: DashboardGridProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const metaByKey = useMemo(
    () => Object.fromEntries(catalog.map((w) => [w.key, w])),
    [catalog],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = visibleKeys.indexOf(String(active.id));
    const newIndex = visibleKeys.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(visibleKeys, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={visibleKeys} strategy={rectSortingStrategy}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 16,
            alignItems: 'start',
          }}
        >
          {visibleKeys.map((key) => {
            const meta = metaByKey[key];
            const Component = components[key];
            if (!meta || !Component) return null;
            return (
              <SortableWidget
                key={key}
                widgetKey={key}
                span={meta.span}
                Component={Component}
                isCustomizing={isCustomizing}
                ownerOnly={ownerScopes[key] ?? false}
                onOwnerOnlyChange={onOwnerOnlyChange}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
