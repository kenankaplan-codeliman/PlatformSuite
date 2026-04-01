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
  Switch,
  DatePicker,
  InputNumber,
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  FileTextOutlined,
  UserOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { RoutePaths } from '@/config/route.paths';
import type { AppointmentActivity } from '@/types/activity.types';
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
import { getEntityColor, getEntityIcon } from '@/config/entity.config';

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
        <Tag key={entity.id} icon={getEntityIcon(entity.entityType)} color={getEntityColor(entity.entityType)}>
          {entity.name}
        </Tag>
      ))}
    </Space>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const AppointmentDetail: React.FC<DetailPageProps<AppointmentActivity>> = (props) => {
  const store = useActivityStore();
  const { t } = useTranslation('activity');
  const { t: tc } = useTranslation('common');

  const detail = useDetailPage<AppointmentActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.Appointment),
      createEntity: (values) => store.createActivity<AppointmentActivity>(values as Omit<AppointmentActivity, 'id' | 'createdAt' | 'createdBy'>),
      updateEntity: (values) => store.updateActivity<AppointmentActivity>(values as Partial<AppointmentActivity> & { activityType: AppointmentActivity['activityType'] }),
      deleteEntity: async (id) => {
        const { deleteActivity } = useActivityStore.getState();
        await deleteActivity(id);
      },
      currentEntity: store.currentActivity as AppointmentActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      mapEntityToForm: (entity) => ({
        subject: entity.subject,
        location: entity.location,
        meetingUrl: entity.meetingUrl,
        meetingNotes: entity.meetingNotes,
        status: entity.status,
        priority: entity.priority,
        isActive: entity.isActive,
        isAllDay: entity.isAllDay,
        isOnline: entity.isOnline,
        isRecurring: entity.isRecurring,
        reminderMinutesBefore: entity.reminderMinutesBefore,
        startDate: entity.startDate ? dayjs(entity.startDate) : null,
        dueDate: entity.dueDate ? dayjs(entity.dueDate) : null,
        organizer: entity.organizer || null,
        attendees: entity.attendees || [],
        regardingEntity: entity.regardingEntity || null,
      }),

      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.Appointment,
        startDate: toLocalISO(values.startDate) ?? undefined,
        dueDate: toLocalISO(values.dueDate) ?? undefined,
      }),

      defaultFormValues: {
        activityType: ActivityType.Appointment,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        isAllDay: false,
        isOnline: false,
        isRecurring: false,
      },

      listPath: RoutePaths.Activity.List,
      getViewPath: (entity) => RoutePaths.Activity.Appointment.View(entity.id),
      completeEntity: (id) => store.completeActivity(id),
      cancelEntity: (id) => store.cancelActivity(id),
    },
    props
  );

  const currentAppointment = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentAppointment?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignActivity(currentAppointment.id, user);
    await store.fetchActivityById(currentAppointment.id, ActivityType.Appointment);
  }, [currentAppointment?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentAppointment?.id) return;
    if (isActive) {
      await store.deactivateActivity(currentAppointment.id);
    } else {
      await store.activateActivity(currentAppointment.id);
    }
    await store.fetchActivityById(currentAppointment.id, ActivityType.Appointment);
  }, [currentAppointment?.id, store]);

  // ─── View Mode ──────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space orientation="vertical" size={4}>
              <Space align="center" wrap>
                <CalendarOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                <Title level={3} style={{ margin: 0 }}>{currentAppointment?.subject}</Title>
                <Tag color={getActivityStatusColor(currentAppointment?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentAppointment?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag color={getActivityPriorityColor(currentAppointment?.priority ?? ActivityPriority.Normal)} icon={<FlagOutlined />}>
                  {getActivityPriorityLabel(currentAppointment?.priority ?? ActivityPriority.Normal)}
                </Tag>
                {currentAppointment?.isAllDay && <Tag color="purple">{t('field.isAllDay')}</Tag>}
                {currentAppointment?.isOnline && <Tag color="blue" icon={<GlobalOutlined />}>{t('field.isOnline')}</Tag>}
                {currentAppointment?.isRecurring && <Tag color="orange">{t('field.isRecurring')}</Tag>}
                <Badge status={currentAppointment?.isActive ? 'success' : 'default'} text={currentAppointment?.isActive ? tc('status.active') : tc('status.inactive')} />
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              {currentAppointment?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={detail.handleComplete}>{t('action.complete')}</Button>
              )}
              {currentAppointment?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={detail.handleCancelActivity}>{t('action.cancel')}</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>{t('section.timeInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('label.startDate')}>
                {currentAppointment?.startDate ? dayjs(currentAppointment.startDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('label.endDate')}>
                {currentAppointment?.dueDate ? dayjs(currentAppointment.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('field.isAllDay')}>
                <Badge status={currentAppointment?.isAllDay ? 'success' : 'default'} text={currentAppointment?.isAllDay ? tc('confirm.yes') : tc('confirm.no')} />
              </Descriptions.Item>
              <Descriptions.Item label={t('label.reminder')}>
                {currentAppointment?.reminderMinutesBefore
                  ? t('appointment.reminderBefore', { count: currentAppointment.reminderMinutesBefore })
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><EnvironmentOutlined /><span>{t('section.locationMeeting')}</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('field.isOnline')}>
                <Badge status={currentAppointment?.isOnline ? 'success' : 'default'} text={currentAppointment?.isOnline ? tc('confirm.yes') : tc('confirm.no')} />
              </Descriptions.Item>
              <Descriptions.Item label={t('field.location')}>{currentAppointment?.location || '-'}</Descriptions.Item>
              <Descriptions.Item label={t('field.meetingUrl')}>
                {currentAppointment?.meetingUrl ? (
                  <a href={currentAppointment.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <Space><LinkOutlined />{t('action.joinMeeting')}</Space>
                  </a>
                ) : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><UserOutlined /><span>{t('field.organizer')}</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentAppointment?.organizer)}
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><TeamOutlined /><span>{t('field.attendees')}</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentAppointment?.attendees)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><LinkOutlined /><span>{t('section.regardingRecord')}</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentAppointment?.regardingEntity)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.meetingNotes')}</span></Space>} style={{ marginBottom: 16 }}>
            <Paragraph>{currentAppointment?.meetingNotes || t('empty.meetingNotes')}</Paragraph>
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
          <Card title={<Space><CalendarOutlined /><span>{t('section.appointmentInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="subject" label={t('field.subject')} rules={[{ required: true, message: t('validation.subjectRequired') }]}>
                  <Input placeholder={t('placeholder.appointmentSubject')} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="isOnline" label={t('field.isOnline')} valuePropName="checked">
                  <Switch checkedChildren={tc('confirm.yes')} unCheckedChildren={tc('confirm.no')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="location" label={t('field.location')}>
                  <Input prefix={<EnvironmentOutlined />} placeholder={t('placeholder.location')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="meetingUrl" label={t('field.meetingUrl')}>
                  <Input prefix={<LinkOutlined />} placeholder={t('placeholder.meetingUrl')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="organizer" label={t('label.selectOrganizer')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User]}
                    multiple={false}
                    modalTitle={t('modal.selectOrganizer')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="attendees" label={t('label.selectAttendees')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Account, EntityType.Contact]}
                    multiple={true}
                    modalTitle={t('modal.selectAttendees')}
                    maxSelections={50}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="regardingEntity" label={t('label.selectRegarding')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Lead, EntityType.Account, EntityType.Contact]}
                    multiple={false}
                    modalTitle={t('modal.selectRegardingEntity')}
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
          <Card title={<Space><ClockCircleOutlined /><span>{t('section.timeInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="startDate" label={t('label.startDate')} rules={[{ required: true, message: t('validation.startDateRequired') }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('placeholder.startDate')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dueDate" label={t('label.endDate')} rules={[{ required: true, message: t('validation.dueDateRequired') }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('placeholder.dueDate')} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="reminderMinutesBefore" label={t('field.reminderMinutesBefore')}>
                  <InputNumber min={0} max={10080} style={{ width: '100%' }} placeholder={t('placeholder.reminderMinutesBefore')} />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="isAllDay" label={t('field.isAllDay')} valuePropName="checked">
                  <Switch checkedChildren={tc('confirm.yes')} unCheckedChildren={tc('confirm.no')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.meetingNotes')}</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="meetingNotes" label={t('label.notes')}>
              <TextArea rows={4} placeholder={t('placeholder.meetingNotes')} />
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
        create: t('appointment.titleCreate'),
        view: t('appointment.titleView'),
        edit: t('appointment.titleEdit'),
      }}
      deleteConfirm={{
        title: t('appointment.deleteTitle'),
        description: t('appointment.deleteDescription'),
      }}
      notFoundTitle={t('appointment.notFoundTitle')}
      notFoundDescription={t('appointment.notFoundDescription')}
      mode={detail.mode}
      isNew={detail.isNew}
      isViewMode={detail.isViewMode}
      isEditMode={detail.isEditMode}
      isCreateMode={detail.isCreateMode}
      isLoading={detail.isLoading}
      entityExists={!!currentAppointment}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentAppointment?.isActive}
      onStateChange={handleStateChange}
    />
  );
};

export default AppointmentDetail;
