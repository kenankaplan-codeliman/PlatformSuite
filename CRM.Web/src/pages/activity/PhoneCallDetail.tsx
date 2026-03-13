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

// ✅ Ortak hook ve layout import
import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { getEntityIcon } from '@/config/entity.config';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── Sayfaya özel sabitler ────────────────────────────────────────────────────
const directionOptions = [
  { label: 'Gelen', value: Direction.Incoming },
  { label: 'Giden', value: Direction.Outgoing },
];

// ─── Component ────────────────────────────────────────────────────────────────

const PhoneCallDetail: React.FC<DetailPageProps<PhoneCallActivity>> = (props) => {
  const store = useActivityStore();

  // ✅ Tüm ortak logic tek satırda
  const detail = useDetailPage<PhoneCallActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.PhoneCall),
      createEntity: (values) => store.createActivity<PhoneCallActivity>(values as any),
      updateEntity: (values) => store.updateActivity<PhoneCallActivity>(values as any),
      deleteEntity: async (id) => {
        const { deleteActivity } = useActivityStore.getState();
        await deleteActivity(id);
      },
      currentEntity: store.currentActivity as PhoneCallActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      // Entity → Form dönüşümü
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

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.PhoneCall,
        startDate: toLocalISO(values.startDate),
        dueDate: toLocalISO(values.dueDate),
      }),

      // Yeni kayıt default'ları
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

  // ─── View Mode (sayfaya özel) ───────────────────────────────────────────

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
                  <SwapOutlined /> {currentPhoneCall?.direction === Direction.Incoming ? 'Gelen' : 'Giden'}
                </Tag>
                <Badge
                  status={currentPhoneCall?.isActive ? 'success' : 'default'}
                  text={currentPhoneCall?.isActive ? 'Aktif' : 'Pasif'}
                />
              </Space>
              <Space>
                <ClockCircleOutlined />
                <Text type="secondary">
                  Son Tarih: {currentPhoneCall?.dueDate ? dayjs(currentPhoneCall.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
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
                Tamamlandı
              </Button>
              <Button icon={<CloseCircleOutlined />} onClick={detail.handleCancelActivity} danger>
                İptal Et
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<Space><PhoneOutlined /><span>Görüşme Bilgileri</span></Space>}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Arayan">
                {currentPhoneCall?.caller ? (
                  <Space>
                    {getEntityIcon(currentPhoneCall.caller.entityType)}
                    <Text>{currentPhoneCall.caller.name}</Text>
                  </Space>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Aranan">
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
            <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>}>
              <Space>
                {getEntityIcon(currentPhoneCall.regardingEntity.entityType)}
                <Text strong>{currentPhoneCall.regardingEntity.name}</Text>
                <Tag>{currentPhoneCall.regardingEntity.entityType}</Tag>
              </Space>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Görüşme Notları</span></Space>}>
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {currentPhoneCall?.callNotes || 'Not bulunmamaktadır'}
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  // ─── Edit Mode (sayfaya özel) ───────────────────────────────────────────

  const renderEditMode = () => (
    <Form form={detail.form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<Space><PhoneOutlined /><span>Görüşme Bilgileri</span></Space>}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="subject" label="Konu" rules={[{ required: true, message: 'Konu gereklidir' }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="Görüşme konusu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="direction" label="Yön" rules={[{ required: true, message: 'Yön gereklidir' }]}>
                  <Select options={directionOptions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Arayan" name="caller" rules={[{ required: true, message: 'Arayan gereklidir' }]}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Lead, EntityType.Contact, EntityType.Account]}
                    multiple={false}
                    modalTitle="Arayan seçin..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Aranan" name="recipient" rules={[{ required: true, message: 'Aranan gereklidir' }]}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Lead, EntityType.Contact, EntityType.Account]}
                    multiple={false}
                    modalTitle="Aranan seçin..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="regardingEntity" label="İlgili Kayıt">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Lead, EntityType.Account, EntityType.Opportunity]}
                    multiple={false}
                    modalTitle="İlgili kayıt seçin..."
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Durum & Öncelik</span></Space>}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="status" label="Durum" rules={[{ required: true }]}>
                  <Select options={activityStatusOptions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="priority" label="Öncelik" rules={[{ required: true }]}>
                  <Select options={activityPriorityOptions} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Zaman Bilgileri</span></Space>}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startDate" label="Başlangıç" rules={[{ required: true }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" label="Bitiş" rules={[{ required: true }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Görüşme Notları</span></Space>}>
            <Form.Item name="callNotes" label="Notlar">
              <TextArea rows={6} placeholder="Görüşme notları..." />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  // ─── Layout ile render ──────────────────────────────────────────────────

  return (
    <DetailPageLayout
      title={{
        create: 'Yeni Telefon Görüşmesi',
        view: 'Görüşme Detayı',
        edit: 'Görüşme Düzenle',
      }}
      deleteConfirm={{
        title: 'Görüşme Silme',
        description: 'Bu telefon görüşmesini silmek istediğinizden emin misiniz?',
      }}
      notFoundTitle="Telefon Görüşmesi Bulunamadı"
      notFoundDescription="Aradığınız telefon görüşmesi bulunamadı veya silinmiş olabilir."
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