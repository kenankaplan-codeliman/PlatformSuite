import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Form,
  Input,
  Select,
  Space,
  Row,
  Col,
  Typography,
  Descriptions,
  Tag,
  Badge,
  Button,
  DatePicker,
  InputNumber,
  Progress,
} from 'antd';
import {
  CheckSquareOutlined,
  FlagOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { RoutePaths } from '@/config/route.paths';
import type { TaskActivity } from '@/types/activity.types';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import {
  ActivityStatus,
  ActivityPriority,
  ActivityType,
  getActivityStatusLabel,
  getActivityStatusColor,
  getActivityPriorityLabel,
  getActivityPriorityColor,
  activityStatusOptions,
  activityPriorityOptions,
} from '@/types/activity.types';
import { useActivityStore } from '@/stores/activity.store';
import { entitySearchService } from '@/services/entity.search.service';
import EntityLookup from '@/components/EntityLookup';
import { toLocalISO } from '@/util/dateHelper';

import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { EntityTypeConfig, getEntityIcon } from '@/config/entity.config';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

// ─── Helper: Entity tag render (view mode) ───────────────────────────────────

const renderSelectedEntities = (entities: EntityReference[] | EntityReference | null | undefined) => {
  if (!entities) return '-';
  const entityList = Array.isArray(entities) ? entities : [entities];
  if (entityList.length === 0) return '-';

  return (
    <Space wrap size={[4, 4]}>
      {entityList.map((entity) => (
        <Tag key={entity.id} icon={getEntityIcon(entity.entityType)} color={EntityTypeConfig[entity.entityType]?.color}>
          {entity.name}
        </Tag>
      ))}
    </Space>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const TaskDetail: React.FC<DetailPageProps<TaskActivity>> = (props) => {
  const store = useActivityStore();
  const { t } = useTranslation('activity');
  const { t: tc } = useTranslation('common');

  const detail = useDetailPage<TaskActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.Task),
      createEntity: (values) => store.createActivity<TaskActivity>(values as Omit<TaskActivity, 'id' | 'createdAt' | 'createdBy'>),
      updateEntity: (values) => store.updateActivity<TaskActivity>(values as Partial<TaskActivity> & { activityType: TaskActivity['activityType'] }),
      deleteEntity: async (id) => {
        const { deleteActivity } = useActivityStore.getState();
        await deleteActivity(id);
      },
      currentEntity: store.currentActivity as TaskActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      mapEntityToForm: (entity) => ({
        subject: entity.subject,
        description: entity.taskDescription,
        status: entity.status,
        priority: entity.priority,
        regardingEntity: entity.regardingEntity || null,
        startDate: entity.startDate ? dayjs(entity.startDate) : null,
        dueDate: entity.dueDate ? dayjs(entity.dueDate) : null,
        reminderAt: entity.reminderAt ? dayjs(entity.reminderAt) : null,
        percentComplete: entity.percentComplete,
      }),

      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.Task,
        startDate: toLocalISO(values.startDate) ?? undefined,
        dueDate: toLocalISO(values.dueDate) ?? undefined,
        reminderAt: toLocalISO(values.reminderAt) ?? undefined,
      }),

      defaultFormValues: {
        activityType: ActivityType.Task,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        percentComplete: 0,
      },

      listPath: RoutePaths.Activity.List,
      getViewPath: (entity) => RoutePaths.Activity.Task.View(entity.id),
      completeEntity: (id) => store.completeActivity(id),
      cancelEntity: (id) => store.cancelActivity(id),
    },
    props
  );

  const currentTask = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentTask?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignActivity(currentTask.id, user);
    await store.fetchActivityById(currentTask.id, ActivityType.Task);
  }, [currentTask?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentTask?.id) return;
    if (isActive) {
      await store.deactivateActivity(currentTask.id);
    } else {
      await store.activateActivity(currentTask.id);
    }
    await store.fetchActivityById(currentTask.id, ActivityType.Task);
  }, [currentTask?.id, store]);

  // ─── View Mode ──────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space orientation="vertical" size={4}>
              <Space align="center" wrap>
                <CheckSquareOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <Title level={3} style={{ margin: 0 }}>{currentTask?.subject}</Title>
                <Tag color={getActivityStatusColor(currentTask?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentTask?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag color={getActivityPriorityColor(currentTask?.priority ?? ActivityPriority.Normal)} icon={<FlagOutlined />}>
                  {getActivityPriorityLabel(currentTask?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Badge status={currentTask?.isActive ? 'success' : 'default'} text={currentTask?.isActive ? tc('status.active') : tc('status.inactive')} />
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              {currentTask?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={detail.handleComplete}>{t('action.complete')}</Button>
              )}
              {currentTask?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={detail.handleCancelActivity}>{t('action.cancel')}</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><FlagOutlined /><span>{t('section.statusProgress')}</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('field.status')}>
                <Tag color={getActivityStatusColor(currentTask?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentTask?.status ?? ActivityStatus.NotStarted)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('field.priority')}>
                <Tag color={getActivityPriorityColor(currentTask?.priority ?? ActivityPriority.Normal)}>
                  {getActivityPriorityLabel(currentTask?.priority ?? ActivityPriority.Normal)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('field.percentComplete')}>
                <Progress percent={currentTask?.percentComplete || 0} size="small" style={{ width: 150 }} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><CalendarOutlined /><span>{t('section.dateInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('label.startDate')}>
                {currentTask?.startDate ? dayjs(currentTask.startDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('label.endDate')}>
                {currentTask?.dueDate ? dayjs(currentTask.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('label.reminder')}>
                {currentTask?.reminderAt ? dayjs(currentTask.reminderAt).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><LinkOutlined /><span>{t('section.regardingRecord')}</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentTask?.regardingEntity)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.description')}</span></Space>} style={{ marginBottom: 16 }}>
            <Paragraph>{currentTask?.taskDescription || t('empty.taskDescription')}</Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  // ─── Edit Mode ──────────────────────────────────────────────────────────

  const renderEditMode = () => (
    <Form form={detail.form} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Card title={<Space><CheckSquareOutlined /><span>{t('section.taskInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="subject" label={t('field.subject')} rules={[{ required: true, message: t('validation.subjectRequired') }]}>
                  <Input placeholder={t('placeholder.taskSubject')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="percentComplete" label={t('label.percentComplete')}>
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}%`}
                    parser={(value) => parseInt(value?.replace('%', '') || '0', 10) as number}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="regardingEntity" label={t('label.selectRegarding')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Lead, EntityType.Account, EntityType.Contact]}
                    multiple={false}
                    modalTitle={t('modal.selectRegarding')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<Space><FlagOutlined /><span>{t('section.statusPriority')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="status" label={t('field.status')} rules={[{ required: true, message: t('validation.statusRequired') }]}>
                  <Select options={activityStatusOptions} placeholder={t('field.status')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="priority" label={t('field.priority')} rules={[{ required: true, message: t('validation.priorityRequired') }]}>
                  <Select options={activityPriorityOptions} placeholder={t('field.priority')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={16}>
          <Card title={<Space><CalendarOutlined /><span>{t('section.timeInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="startDate" label={t('field.startDate')} rules={[{ required: true, message: t('validation.startDateRequired') }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('placeholder.startDate')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dueDate" label={t('field.endDate')} rules={[{ required: true, message: t('validation.dueDateRequired') }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('placeholder.dueDate')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="reminderAt" label={t('label.reminder')}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('label.reminder')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.description')}</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="description" label={t('field.description')}>
              <TextArea rows={4} placeholder={t('placeholder.taskDescription')} />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  // ─── Layout ─────────────────────────────────────────────────────────────

  return (
    <DetailPageLayout
      title={{
        create: t('task.titleCreate'),
        view: t('task.titleView'),
        edit: t('task.titleEdit'),
      }}
      deleteConfirm={{
        title: t('task.deleteTitle'),
        description: t('task.deleteDescription'),
      }}
      notFoundTitle={t('task.notFoundTitle')}
      notFoundDescription={t('task.notFoundDescription')}
      mode={detail.mode}
      isNew={detail.isNew}
      isViewMode={detail.isViewMode}
      isEditMode={detail.isEditMode}
      isCreateMode={detail.isCreateMode}
      isLoading={detail.isLoading}
      entityExists={!!currentTask}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentTask?.isActive}
      onStateChange={handleStateChange}
    />
  );
};

export default TaskDetail;
