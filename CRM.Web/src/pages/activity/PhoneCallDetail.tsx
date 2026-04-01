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
} from 'antd';
import {
  PhoneOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { RoutePaths } from '@/config/route.paths';
import type { PhoneCallActivity } from '@/types/activity.types';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import {
  ActivityStatus,
  ActivityPriority,
  ActivityType,
  Direction,
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
import { getEntityIcon } from '@/config/entity.config';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── Component ────────────────────────────────────────────────────────────────

const PhoneCallDetail: React.FC<DetailPageProps<PhoneCallActivity>> = (props) => {
  const store = useActivityStore();
  const { t } = useTranslation('activity');
  const { t: te } = useTranslation('enums');
  const { t: tc } = useTranslation('common');

  const directionOptions = [
    { label: te('direction.Incoming'), value: Direction.Incoming },
    { label: te('direction.Outgoing'), value: Direction.Outgoing },
  ];

  const detail = useDetailPage<PhoneCallActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.PhoneCall),
      createEntity: (values) => store.createActivity<PhoneCallActivity>(values as Omit<PhoneCallActivity, 'id' | 'createdAt' | 'createdBy'>),
      updateEntity: (values) => store.updateActivity<PhoneCallActivity>(values as Partial<PhoneCallActivity> & { activityType: PhoneCallActivity['activityType'] }),
      deleteEntity: async (id) => {
        const { deleteActivity } = useActivityStore.getState();
        await deleteActivity(id);
      },
      currentEntity: store.currentActivity as PhoneCallActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      mapEntityToForm: (entity) => ({
        subject: entity.subject,
        direction: entity.direction,
        callNotes: entity.callNotes,
        status: entity.status,
        priority: entity.priority,
        startDate: entity.startDate ? dayjs(entity.startDate) : null,
        dueDate: entity.dueDate ? dayjs(entity.dueDate) : null,
        isActive: entity.isActive,
        caller: entity.caller || null,
        recipient: entity.recipient || null,
        regardingEntity: entity.regardingEntity || null,
      }),

      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.PhoneCall,
        startDate: toLocalISO(values.startDate),
        dueDate: toLocalISO(values.dueDate),
      }),

      defaultFormValues: {
        direction: Direction.Outgoing,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
      },

      listPath: RoutePaths.Activity.List,
      getViewPath: (entity) => RoutePaths.Activity.PhoneCall.View(entity.id),
      completeEntity: (id) => store.completeActivity(id),
      cancelEntity: (id) => store.cancelActivity(id),
    },
    props
  );

  const currentPhoneCall = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentPhoneCall?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignActivity(currentPhoneCall.id, user);
    await store.fetchActivityById(currentPhoneCall.id, ActivityType.PhoneCall);
  }, [currentPhoneCall?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentPhoneCall?.id) return;
    if (isActive) {
      await store.deactivateActivity(currentPhoneCall.id);
    } else {
      await store.activateActivity(currentPhoneCall.id);
    }
    await store.fetchActivityById(currentPhoneCall.id, ActivityType.PhoneCall);
  }, [currentPhoneCall?.id, store]);

  // ─── View Mode ──────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space orientation="vertical" size={4}>
              <Space align="center">
                <Title level={3} style={{ margin: 0 }}>
                  {currentPhoneCall?.subject}
                </Title>
                <Tag color={getActivityStatusColor(currentPhoneCall?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentPhoneCall?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag color={getActivityPriorityColor(currentPhoneCall?.priority ?? ActivityPriority.Normal)}>
                  {getActivityPriorityLabel(currentPhoneCall?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Tag color={currentPhoneCall?.direction === Direction.Incoming ? 'green' : 'blue'}>
                  <SwapOutlined /> {currentPhoneCall?.direction === Direction.Incoming ? te('direction.Incoming') : te('direction.Outgoing')}
                </Tag>
                <Badge
                  status={currentPhoneCall?.isActive ? 'success' : 'default'}
                  text={currentPhoneCall?.isActive ? tc('status.active') : tc('status.inactive')}
                />
              </Space>
              <Space>
                <ClockCircleOutlined />
                <Text type="secondary">
                  {t('phoneCall.dueDate')}: {currentPhoneCall?.dueDate ? dayjs(currentPhoneCall.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
                </Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={detail.handleComplete}
                disabled={currentPhoneCall?.status === ActivityStatus.Completed}
              >
                {t('action.completed')}
              </Button>
              <Button icon={<CloseCircleOutlined />} onClick={detail.handleCancelActivity} danger>
                {t('action.cancel')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<Space><PhoneOutlined /><span>{t('section.callInfo')}</span></Space>}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label={t('field.caller')}>
                {currentPhoneCall?.caller ? (
                  <Space>
                    {getEntityIcon(currentPhoneCall.caller.entityType)}
                    <Text>{currentPhoneCall.caller.name}</Text>
                  </Space>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('field.recipient')}>
                {currentPhoneCall?.recipient ? (
                  <Space>
                    {getEntityIcon(currentPhoneCall.recipient.entityType)}
                    <Text>{currentPhoneCall.recipient.name}</Text>
                  </Space>
                ) : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {currentPhoneCall?.regardingEntity && (
          <Col span={24}>
            <Card title={<Space><LinkOutlined /><span>{t('section.regardingRecord')}</span></Space>}>
              <Space>
                {getEntityIcon(currentPhoneCall.regardingEntity.entityType)}
                <Text strong>{currentPhoneCall.regardingEntity.name}</Text>
                <Tag>{currentPhoneCall.regardingEntity.entityType}</Tag>
              </Space>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.callNotes')}</span></Space>}>
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {currentPhoneCall?.callNotes || t('empty.callNotes')}
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  // ─── Edit Mode ──────────────────────────────────────────────────────────

  const renderEditMode = () => (
    <Form form={detail.form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<Space><PhoneOutlined /><span>{t('section.callInfo')}</span></Space>}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="subject" label={t('field.subject')} rules={[{ required: true, message: t('validation.subjectRequired') }]}>
                  <Input prefix={<PhoneOutlined />} placeholder={t('placeholder.phoneSubject')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="direction" label={t('field.direction')} rules={[{ required: true, message: t('validation.directionRequired') }]}>
                  <Select options={directionOptions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('field.caller')} name="caller" rules={[{ required: true, message: t('validation.callerRequired') }]}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Lead, EntityType.Contact, EntityType.Account]}
                    multiple={false}
                    modalTitle={t('modal.selectCaller')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('field.recipient')} name="recipient" rules={[{ required: true, message: t('validation.recipientRequired') }]}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Lead, EntityType.Contact, EntityType.Account]}
                    multiple={false}
                    modalTitle={t('modal.selectRecipient')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="regardingEntity" label={t('label.selectRegarding')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Lead, EntityType.Account, EntityType.Opportunity]}
                    multiple={false}
                    modalTitle={t('modal.selectRegardingEntity')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>{t('section.statusPriority')}</span></Space>}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="status" label={t('field.status')} rules={[{ required: true }]}>
                  <Select options={activityStatusOptions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="priority" label={t('field.priority')} rules={[{ required: true }]}>
                  <Select options={activityPriorityOptions} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>{t('section.timeInfo')}</span></Space>}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startDate" label={t('label.startDate')} rules={[{ required: true }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" label={t('label.endDate')} rules={[{ required: true }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.callNotes')}</span></Space>}>
            <Form.Item name="callNotes" label={t('label.notes')}>
              <TextArea rows={6} placeholder={t('placeholder.callNotes')} />
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
        create: t('phoneCall.titleCreate'),
        view: t('phoneCall.titleView'),
        edit: t('phoneCall.titleEdit'),
      }}
      deleteConfirm={{
        title: t('phoneCall.deleteTitle'),
        description: t('phoneCall.deleteDescription'),
      }}
      notFoundTitle={t('phoneCall.notFoundTitle')}
      notFoundDescription={t('phoneCall.notFoundDescription')}
      mode={detail.mode}
      isNew={detail.isNew}
      isViewMode={detail.isViewMode}
      isEditMode={detail.isEditMode}
      isCreateMode={detail.isCreateMode}
      isLoading={detail.isLoading}
      entityExists={!!currentPhoneCall}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentPhoneCall?.isActive}
      onStateChange={handleStateChange}
    />
  );
};

export default PhoneCallDetail;
