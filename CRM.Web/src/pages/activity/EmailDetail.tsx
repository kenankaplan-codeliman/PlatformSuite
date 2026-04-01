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
  DatePicker,
} from 'antd';
import {
  MailOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  FileTextOutlined,
  SendOutlined,
  LinkOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';

import { RoutePaths } from '@/config/route.paths';
import type { EmailActivity } from '@/types/activity.types';
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

const { Title } = Typography;
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

const EmailDetail: React.FC<DetailPageProps<EmailActivity>> = (props) => {
  const store = useActivityStore();
  const { t } = useTranslation('activity');
  const { t: tc } = useTranslation('common');

  const detail = useDetailPage<EmailActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.Email),
      createEntity: (values) => store.createActivity<EmailActivity>(values as Omit<EmailActivity, 'id' | 'createdAt' | 'createdBy'>),
      updateEntity: (values) => store.updateActivity<EmailActivity>(values as Partial<EmailActivity> & { activityType: EmailActivity['activityType'] }),
      deleteEntity: async (id) => {
        await store.deleteActivity(id);
      },
      currentEntity: store.currentActivity as EmailActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      mapEntityToForm: (entity) => ({
        subject: entity.subject,
        body: entity.body,
        status: entity.status,
        priority: entity.priority,
        startDate: entity.startDate ? dayjs(entity.startDate) : null,
        dueDate: entity.dueDate ? dayjs(entity.dueDate) : null,
        readDate: entity.readDate ? dayjs(entity.readDate) : null,
        from: entity.from || null,
        to: entity.to || [],
        cc: entity.cc || [],
        bcc: entity.bcc || [],
        regardingEntity: entity.regardingEntity || null,
      }),

      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.Email,
        startDate: toLocalISO(values.startDate) ?? undefined,
        dueDate: toLocalISO(values.dueDate) ?? undefined,
        readDate: toLocalISO(values.readDate) ?? undefined,
      }),

      defaultFormValues: {
        activityType: ActivityType.Email,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
      },

      listPath: RoutePaths.Activity.List,
      getViewPath: (entity) => RoutePaths.Activity.Email.View(entity.id),
    },
    props
  );

  const currentEmail = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentEmail?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignActivity(currentEmail.id, user);
    await store.fetchActivityById(currentEmail.id, ActivityType.Email);
  }, [currentEmail?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentEmail?.id) return;
    if (isActive) {
      await store.deactivateActivity(currentEmail.id);
    } else {
      await store.activateActivity(currentEmail.id);
    }
    await store.fetchActivityById(currentEmail.id, ActivityType.Email);
  }, [currentEmail?.id, store]);

  // ─── View Mode ──────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space orientation="vertical" size={4}>
              <Space align="center" wrap>
                <MailOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Title level={3} style={{ margin: 0 }}>{currentEmail?.subject}</Title>
                <Tag color={getActivityStatusColor(currentEmail?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentEmail?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag color={getActivityPriorityColor(currentEmail?.priority ?? ActivityPriority.Normal)} icon={<FlagOutlined />}>
                  {getActivityPriorityLabel(currentEmail?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Badge
                  status={currentEmail?.isActive ? 'success' : 'default'}
                  text={currentEmail?.isActive ? tc('status.active') : tc('status.inactive')}
                />
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><SendOutlined /><span>{t('section.senderRecipients')}</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('field.from')}>{renderSelectedEntities(currentEmail?.from)}</Descriptions.Item>
              <Descriptions.Item label={t('field.to')}>{renderSelectedEntities(currentEmail?.to)}</Descriptions.Item>
              <Descriptions.Item label={t('field.cc')}>{renderSelectedEntities(currentEmail?.cc)}</Descriptions.Item>
              <Descriptions.Item label={t('field.bcc')}>{renderSelectedEntities(currentEmail?.bcc)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>{t('section.dateInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('label.emailCreatedDate')}>
                {currentEmail?.startDate ? dayjs(currentEmail.startDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('label.emailSentDate')}>
                {currentEmail?.dueDate ? dayjs(currentEmail.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('label.emailReadDate')}>
                {currentEmail?.readDate ? dayjs(currentEmail.readDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><LinkOutlined /><span>{t('section.regardingRecord')}</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentEmail?.regardingEntity)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.emailContent')}</span></Space>} style={{ marginBottom: 16 }}>
            <div
              style={{ padding: 16, background: '#fafafa', borderRadius: 4, minHeight: 200 }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentEmail?.body || `<p>${t('empty.emailContent')}</p>`) }}
            />
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
          <Card title={<Space><MailOutlined /><span>{t('section.emailInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="subject" label={t('field.subject')} rules={[{ required: true, message: t('validation.subjectRequired') }]}>
                  <Input placeholder={t('placeholder.emailSubject')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="from" label={t('label.selectFrom')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User]}
                    multiple={false}
                    modalTitle={t('modal.selectFrom')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="to" label={t('label.selectTo')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Contact, EntityType.Account]}
                    multiple={true}
                    modalTitle={t('modal.selectTo')}
                    maxSelections={50}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cc" label={t('label.selectCc')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Contact, EntityType.Account]}
                    multiple={true}
                    modalTitle={t('modal.selectCc')}
                    maxSelections={50}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="bcc" label={t('label.selectBcc')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Contact, EntityType.Account]}
                    multiple={true}
                    modalTitle={t('modal.selectBcc')}
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
                    modalTitle={t('modal.selectRegarding')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={<Space><FlagOutlined /><span>{t('section.statusDirection')}</span></Space>} style={{ marginBottom: 16 }}>
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
                <Form.Item name="startDate" label={t('label.emailCreatedDate')} rules={[{ required: true, message: t('validation.emailStartDateRequired') }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('placeholder.emailStartDate')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dueDate" label={t('label.emailSentDate')} rules={[{ required: true, message: t('validation.emailDueDateRequired') }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('placeholder.emailDueDate')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="readDate" label={t('label.emailReadDate')}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder={t('label.emailReadDate')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.emailContent')}</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="body" label={t('field.body')}>
              <TextArea rows={8} placeholder={t('placeholder.emailContent')} />
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
        create: t('email.titleCreate'),
        view: t('email.titleView'),
        edit: t('email.titleEdit'),
      }}
      deleteConfirm={{
        title: t('email.deleteTitle'),
        description: t('email.deleteDescription'),
      }}
      notFoundTitle={t('email.notFoundTitle')}
      notFoundDescription={t('email.notFoundDescription')}
      mode={detail.mode}
      isNew={detail.isNew}
      isViewMode={detail.isViewMode}
      isEditMode={detail.isEditMode}
      isCreateMode={detail.isCreateMode}
      isLoading={detail.isLoading}
      entityExists={!!currentEmail}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentEmail?.isActive}
      onStateChange={handleStateChange}
    />
  );
};

export default EmailDetail;
