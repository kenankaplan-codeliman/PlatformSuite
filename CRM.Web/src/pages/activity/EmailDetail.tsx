import React, { useCallback } from 'react';
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

  const detail = useDetailPage<EmailActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.Email),
      createEntity: (values) => store.createActivity<EmailActivity>(values as any),
      updateEntity: (values) => store.updateActivity<EmailActivity>(values as any),
      deleteEntity: async (id) => {
        const { deleteActivity } = useActivityStore.getState();
        await deleteActivity(id);
      },
      currentEntity: store.currentActivity as EmailActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      // Entity → Form dönüşümü
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

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.Email,
        startDate: toLocalISO(values.startDate) ?? undefined,
        dueDate: toLocalISO(values.dueDate) ?? undefined,
        readDate: toLocalISO(values.readDate) ?? undefined,
      }),

      // Yeni kayıt default'ları
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
                  text={currentEmail?.isActive ? 'Aktif' : 'Pasif'}
                />
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><SendOutlined /><span>Gönderen / Alıcılar</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Kimden">{renderSelectedEntities(currentEmail?.from)}</Descriptions.Item>
              <Descriptions.Item label="Kime">{renderSelectedEntities(currentEmail?.to)}</Descriptions.Item>
              <Descriptions.Item label="CC">{renderSelectedEntities(currentEmail?.cc)}</Descriptions.Item>
              <Descriptions.Item label="BCC">{renderSelectedEntities(currentEmail?.bcc)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Tarih Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Oluşturma Tarihi">
                {currentEmail?.startDate ? dayjs(currentEmail.startDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Gönderilme Tarihi">
                {currentEmail?.dueDate ? dayjs(currentEmail.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Okunma Tarihi">
                {currentEmail?.readDate ? dayjs(currentEmail.readDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentEmail?.regardingEntity)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>E-posta İçeriği</span></Space>} style={{ marginBottom: 16 }}>
            <div
              style={{ padding: 16, background: '#fafafa', borderRadius: 4, minHeight: 200 }}
              dangerouslySetInnerHTML={{ __html: currentEmail?.body || '<p>İçerik bulunmuyor.</p>' }}
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
        {/* Konu */}
        <Col span={24}>
          <Card title={<Space><MailOutlined /><span>E-posta Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="subject" label="Konu" rules={[{ required: true, message: 'Konu gereklidir' }]}>
                  <Input placeholder="E-posta konusu girin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="from" label="Gönderen Seçin">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User]}
                    multiple={false}
                    modalTitle="Gönderen Seç"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="to" label="Alıcıları Seçin">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Contact, EntityType.Account]}
                    multiple={true}
                    modalTitle="Alıcı Seç"
                    maxSelections={50}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cc" label="CC Alıcılarını Seçin">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Contact, EntityType.Account]}
                    multiple={true}
                    modalTitle="CC Seç"
                    maxSelections={50}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="bcc" label="BCC Alıcılarını Seçin">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Contact, EntityType.Account]}
                    multiple={true}
                    modalTitle="BCC Seç"
                    maxSelections={50}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="regardingEntity" label="İlgili Kaydı Seçin">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Lead, EntityType.Account, EntityType.Contact]}
                    multiple={false}
                    modalTitle="İlgili Kayıt Seç"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Durum & Yön */}
        <Col span={8}>
          <Card title={<Space><FlagOutlined /><span>Durum & Yön</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="status" label="Durum" rules={[{ required: true, message: 'Durum seçimi gereklidir' }]}>
                  <Select options={activityStatusOptions} placeholder="Durum seçin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="priority" label="Öncelik" rules={[{ required: true, message: 'Öncelik seçimi gereklidir' }]}>
                  <Select options={activityPriorityOptions} placeholder="Öncelik seçin" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Zaman Bilgileri*/}
        <Col span={16}>
          <Card title={<Space><CalendarOutlined /><span>Zaman Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="startDate" label="Oluşturma Tarihi" rules={[{ required: true, message: 'Oluşturma tarihi gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Oluşturma tarihi" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dueDate" label="Gönderilme Tarihi" rules={[{ required: true, message: 'Gönderilme tarihi gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Gönderilme tarihi" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="readDate" label="Okunma Tarihi">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Okunma tarihi" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* E-posta İçeriği */}
        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>E-posta İçeriği</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="body" label="İçerik">
              <TextArea rows={8} placeholder="E-posta içeriği..." />
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
        create: 'Yeni E-posta',
        view: 'E-posta Detayı',
        edit: 'E-posta Düzenle',
      }}
      deleteConfirm={{
        title: 'E-posta Silme',
        description: 'Bu e-postayı silmek istediğinizden emin misiniz?',
      }}
      notFoundTitle="E-posta Bulunamadı"
      notFoundDescription="Aradığınız e-posta bulunamadı veya silinmiş olabilir."
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