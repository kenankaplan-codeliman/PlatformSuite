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

import { RoutePaths } from '@/constants/route.paths';
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

const TaskDetail: React.FC<DetailPageProps<TaskActivity>> = (props) => {
  const store = useActivityStore();

  const detail = useDetailPage<TaskActivity>(
    {
      fetchById: (id) => store.fetchActivityById(id, ActivityType.Task),
      createEntity: (values) => store.createActivity<TaskActivity>(values as any),
      updateEntity: (values) => store.updateActivity<TaskActivity>(values),
      deleteEntity: async (id) => {
        const { deleteActivity } = useActivityStore.getState();
        await deleteActivity(id);
      },
      currentEntity: store.currentActivity as TaskActivity | null,
      clearCurrentEntity: () => store.setCurrentActivity(null),

      // Entity → Form dönüşümü
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

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        activityType: ActivityType.Task,
        startDate: toLocalISO(values.startDate) ?? undefined,
        dueDate: toLocalISO(values.dueDate) ?? undefined,
        reminderAt: toLocalISO(values.reminderAt) ?? undefined,
      }),

      // Yeni kayıt default'ları
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

  // ─── View Mode ──────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Space align="center" wrap>
                <CheckSquareOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <Title level={3} style={{ margin: 0 }}>{currentTask?.subject}</Title>
                <Tag color={getActivityStatusColor(currentTask?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentTask?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag color={getActivityPriorityColor(currentTask?.priority ?? ActivityPriority.Normal)} icon={<FlagOutlined />}>
                  {getActivityPriorityLabel(currentTask?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Badge status={currentTask?.isActive ? 'success' : 'default'} text={currentTask?.isActive ? 'Aktif' : 'Pasif'} />
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              {currentTask?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={detail.handleComplete}>Tamamla</Button>
              )}
              {currentTask?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={detail.handleCancelActivity}>İptal Et</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><FlagOutlined /><span>Durum & İlerleme</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Durum">
                <Tag color={getActivityStatusColor(currentTask?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentTask?.status ?? ActivityStatus.NotStarted)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Öncelik">
                <Tag color={getActivityPriorityColor(currentTask?.priority ?? ActivityPriority.Normal)}>
                  {getActivityPriorityLabel(currentTask?.priority ?? ActivityPriority.Normal)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tamamlanma">
                <Progress percent={currentTask?.percentComplete || 0} size="small" style={{ width: 150 }} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><CalendarOutlined /><span>Tarih Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Başlangıç">
                {currentTask?.startDate ? dayjs(currentTask.startDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bitiş">
                {currentTask?.dueDate ? dayjs(currentTask.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Hatırlatma">
                {currentTask?.reminderAt ? dayjs(currentTask.reminderAt).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentTask?.regardingEntity)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Açıklama</span></Space>} style={{ marginBottom: 16 }}>
            <Paragraph>{currentTask?.taskDescription || 'Açıklama girilmemiş.'}</Paragraph>
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
          <Card title={<Space><CheckSquareOutlined /><span>Görev Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="subject" label="Konu" rules={[{ required: true, message: 'Konu gereklidir' }]}>
                  <Input placeholder="Görev konusu girin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="percentComplete" label="Tamamlanma Yüzdesi">
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}%`}
                    parser={(value) => parseInt(value?.replace('%', '') || '0', 10) as any}
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
          <Card title={<Space><CalendarOutlined /><span>Zaman Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="startDate" label="Başlangıç Tarihi" rules={[{ required: true, message: 'Başlangıç tarihi gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Başlangıç tarihi" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="dueDate" label="Bitiş Tarihi" rules={[{ required: true, message: 'Bitiş tarihi gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Bitiş tarihi" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="reminderAt" label="Hatırlatma">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Hatırlatma tarihi" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Açıklama</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="description" label="Açıklama">
              <TextArea rows={4} placeholder="Görev hakkında notlar..." />
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
        create: 'Yeni Görev',
        view: 'Görev Detayı',
        edit: 'Görev Düzenle',
      }}
      deleteConfirm={{
        title: 'Görev Silme',
        description: 'Bu görevi silmek istediğinizden emin misiniz?',
      }}
      notFoundTitle="Görev Bulunamadı"
      notFoundDescription="Aradığınız görev bulunamadı veya silinmiş olabilir."
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
    />
  );
};

export default TaskDetail;