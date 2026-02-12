import React from 'react';
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

import { RoutePaths } from '@/constants/route.paths';
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
import EntityLookup, { EntityTypeConfig } from '@/components/EntityLookup';
import { toLocalISO } from '@/util/dateHelper';

import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { getEntityIcon } from '@/constants/entity.icons';

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

const AppointmentDetail: React.FC<DetailPageProps<AppointmentActivity>> = (props) => {
  const store = useActivityStore();

  const detail = useDetailPage<AppointmentActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.Appointment),
      createEntity: (values) => store.createActivity<AppointmentActivity>(values as any),
      updateEntity: (values) => store.updateActivity<AppointmentActivity>(values),
      deleteEntity: async (id) => {
        const { deleteActivity } = useActivityStore.getState();
        await deleteActivity(id);
      },
      currentEntity: store.currentActivity as AppointmentActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      // Entity → Form dönüşümü
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

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.Appointment,
        startDate: toLocalISO(values.startDate) ?? undefined,
        dueDate: toLocalISO(values.dueDate) ?? undefined,
      }),

      // Yeni kayıt default'ları
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
                {currentAppointment?.isAllDay && <Tag color="purple">Tüm Gün</Tag>}
                {currentAppointment?.isOnline && <Tag color="blue" icon={<GlobalOutlined />}>Online</Tag>}
                {currentAppointment?.isRecurring && <Tag color="orange">Tekrarlı</Tag>}
                <Badge status={currentAppointment?.isActive ? 'success' : 'default'} text={currentAppointment?.isActive ? 'Aktif' : 'Pasif'} />
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              {currentAppointment?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={detail.handleComplete}>Tamamla</Button>
              )}
              {currentAppointment?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={detail.handleCancelActivity}>İptal Et</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Zaman Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Başlangıç">
                {currentAppointment?.startDate ? dayjs(currentAppointment.startDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bitiş">
                {currentAppointment?.dueDate ? dayjs(currentAppointment.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Tüm Gün">
                <Badge status={currentAppointment?.isAllDay ? 'success' : 'default'} text={currentAppointment?.isAllDay ? 'Evet' : 'Hayır'} />
              </Descriptions.Item>
              <Descriptions.Item label="Hatırlatma">
                {currentAppointment?.reminderMinutesBefore ? `${currentAppointment.reminderMinutesBefore} dakika önce` : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><EnvironmentOutlined /><span>Konum & Toplantı</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Online">
                <Badge status={currentAppointment?.isOnline ? 'success' : 'default'} text={currentAppointment?.isOnline ? 'Evet' : 'Hayır'} />
              </Descriptions.Item>
              <Descriptions.Item label="Konum">{currentAppointment?.location || '-'}</Descriptions.Item>
              <Descriptions.Item label="Toplantı Linki">
                {currentAppointment?.meetingUrl ? (
                  <a href={currentAppointment.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <Space><LinkOutlined />Toplantıya Katıl</Space>
                  </a>
                ) : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><UserOutlined /><span>Organizatör</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentAppointment?.organizer)}
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><TeamOutlined /><span>Katılımcılar</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentAppointment?.attendees)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentAppointment?.regardingEntity)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Toplantı Notları</span></Space>} style={{ marginBottom: 16 }}>
            <Paragraph>{currentAppointment?.meetingNotes || 'Not girilmemiş.'}</Paragraph>
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
          <Card title={<Space><CalendarOutlined /><span>Randevu Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="subject" label="Konu" rules={[{ required: true, message: 'Konu gereklidir' }]}>
                  <Input placeholder="Randevu konusu girin" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="isOnline" label="Online" valuePropName="checked">
                  <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="location" label="Konum">
                  <Input prefix={<EnvironmentOutlined />} placeholder="Toplantı konumu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="meetingUrl" label="Toplantı Linki">
                  <Input prefix={<LinkOutlined />} placeholder="https://meet.google.com/..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="organizer" label="Organizatör Seçin">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User]}
                    multiple={false}
                    modalTitle="Organizatör seçin..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="attendees" label="Katılımcıları Seçin">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Account, EntityType.Contact]}
                    multiple={true}
                    modalTitle="Katılımcı ekleyin..."
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
                    modalTitle="İlgili kayıt seçin..."
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={<Space><FlagOutlined /><span>Durum & Öncelik</span></Space>} style={{ marginBottom: 16 }}>
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

        <Col span={16}>
          <Card title={<Space><ClockCircleOutlined /><span>Zaman Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="startDate" label="Başlangıç" rules={[{ required: true, message: 'Başlangıç zamanı gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Başlangıç zamanı" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dueDate" label="Bitiş" rules={[{ required: true, message: 'Bitiş zamanı gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Bitiş zamanı" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="reminderMinutesBefore" label="Hatırlatma (dk)">
                  <InputNumber min={0} max={10080} style={{ width: '100%' }} placeholder="Örn: 15" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="isAllDay" label="Tüm Gün" valuePropName="checked">
                  <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Toplantı Notları</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="meetingNotes" label="Notlar">
              <TextArea rows={4} placeholder="Toplantı hakkında notlar..." />
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
        create: 'Yeni Randevu',
        view: 'Randevu Detayı',
        edit: 'Randevu Düzenle',
      }}
      deleteConfirm={{
        title: 'Randevu Silme',
        description: 'Bu randevuyu silmek istediğinizden emin misiniz?',
      }}
      notFoundTitle="Randevu Bulunamadı"
      notFoundDescription="Aradığınız randevu bulunamadı veya silinmiş olabilir."
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
    />
  );
};

export default AppointmentDetail;