import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Descriptions,
  Tag,
  Tooltip,
  Popconfirm,
  Badge,
  Switch,
  DatePicker,
  InputNumber,
  Progress,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  BankOutlined,
  IdcardOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TaskActivity } from '@/types/activity.types';
import type { EntityReference, EntityType as LookupEntityType } from '@/types/entity.lookup.types';
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
import { StateType, useProcessState } from '@/stores/process.state.store';
import EntityLookup, { EntityTypeConfig } from '@/components/EntityLookup';
import { mockEntitySearch } from '@/services/entity.search.service';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Page mode type
export type TaskDetailMode = 'view' | 'edit' | 'create';

// Props interface for component reuse
export interface TaskDetailProps {
  mode?: TaskDetailMode;
  taskId?: string;
  onModeChange?: (mode: TaskDetailMode) => void;
  onSave?: (task: TaskActivity) => void;
  onCancel?: () => void;
}

// Helper function to get entity icon
const getEntityIcon = (entityType: LookupEntityType) => {
  const icons: Record<LookupEntityType, React.ReactNode> = {
    User: <UserOutlined />,
    Account: <BankOutlined />,
    Contact: <IdcardOutlined />,
    Lead: <RocketOutlined />,
    Opportunity: <CalendarOutlined />,
  };
  return icons[entityType];
};

const TaskDetail: React.FC<TaskDetailProps> = (props) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  const { state } = useProcessState.getState();

  const urlMode = searchParams.get('mode') as TaskDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<TaskDetailMode>(initialMode);

  // Lookup field states - EntityReference tipinde
  const [assignedTo, setAssignedTo] = useState<EntityReference | null>(null);
  const [regarding, setRegarding] = useState<EntityReference | null>(null);

  const taskId = props.taskId || params.id;
  const isNewTask = taskId === 'new' || !taskId;

  const {
    currentActivity,
    fetchActivityById,
    createActivity,
    updateActivity,
    setCurrentActivity,
    completeActivity,
    cancelActivity,
  } = useActivityStore();

  const currentTask = currentActivity as TaskActivity | null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewTask;

  const isFirstRender = useRef(true);

  const updateMode = useCallback(
    (newMode: TaskDetailMode) => {
      setMode(newMode);
      if (!props.mode) {
        setSearchParams({ mode: newMode }, { replace: true });
      }
      props.onModeChange?.(newMode);
    },
    [props, setSearchParams]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (!isNewTask && taskId) {
        fetchActivityById(taskId, ActivityType.Task);
      } else {
        setCurrentActivity(null);
        setMode('create');
      }
    }
  }, [taskId, isNewTask, fetchActivityById, setCurrentActivity]);

  useEffect(() => {
    const urlMode = searchParams.get('mode') as TaskDetailMode | null;
    if (urlMode && urlMode !== mode && !isNewTask) {
      setMode(urlMode);
    }
  }, [searchParams, isNewTask, mode]);

  useEffect(() => {
    if (currentTask && !isNewTask) {
      form.setFieldsValue({
        ...currentTask,
        dueDate: currentTask.dueDate ? dayjs(currentTask.dueDate) : null,
        startDate: currentTask.startDate ? dayjs(currentTask.startDate) : null,
        reminderDateTime: currentTask.reminderDateTime ? dayjs(currentTask.reminderDateTime) : null,
      });

      setAssignedTo(currentTask.assignedTo || null);
      setRegarding(currentTask.regardingEntity || null);
    } else if (isNewTask) {
      form.resetFields();
      setAssignedTo(null);
      setRegarding(null);
      form.setFieldsValue({
        activityType: ActivityType.Task,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        percentComplete: 0,
      });
    }
  }, [currentTask, form, isNewTask]);

  const handleEdit = useCallback(() => updateMode('edit'), [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNewTask) {
      navigate(RoutePaths.Activity.List);
    } else {
      form.setFieldsValue({
        ...currentTask,
        dueDate: currentTask?.dueDate ? dayjs(currentTask.dueDate) : null,
        startDate: currentTask?.startDate ? dayjs(currentTask.startDate) : null,
        reminderDateTime: currentTask?.reminderDateTime ? dayjs(currentTask.reminderDateTime) : null,
      });
      setAssignedTo(currentTask?.assignedTo || null);
      setRegarding(currentTask?.regardingEntity || null);
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewTask, navigate, form, currentTask, updateMode, props]);

  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    const formattedValues: Partial<TaskActivity> = {
      ...values,
      activityType: ActivityType.Task,
      dueDate: values.dueDate?.toISOString(),
      startDate: values.startDate?.toISOString(),
      reminderDateTime: values.reminderDateTime?.toISOString(),
      assignedTo: assignedTo,
      regardingEntity: regarding,
      regardingEntityType: regarding?.entityType || null,
      regardingEntityId: regarding?.id || null,
    };

    if (isNewTask) {
      const newTask = await createActivity<TaskActivity>(formattedValues as any);
      props.onSave?.(newTask);
      navigate(RoutePaths.Activity.Task.View(newTask.id));
    } else if (taskId) {
      const updatedTask = await updateActivity<TaskActivity>(taskId, formattedValues);
      props.onSave?.(updatedTask);
      updateMode('view');
    }
  }, [form, isNewTask, taskId, createActivity, updateActivity, navigate, updateMode, props, assignedTo, regarding]);

  const handleDelete = useCallback(async () => {
    if (!taskId || isNewTask) return;
    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(taskId);
    navigate(RoutePaths.Activity.List);
  }, [taskId, isNewTask, navigate]);

  const handleComplete = useCallback(async () => {
    if (!taskId || isNewTask) return;
    await completeActivity(taskId);
  }, [taskId, isNewTask, completeActivity]);

  const handleCancelActivity = useCallback(async () => {
    if (!taskId || isNewTask) return;
    await cancelActivity(taskId);
  }, [taskId, isNewTask, cancelActivity]);

  const handleBack = useCallback(() => navigate(RoutePaths.Activity.List), [navigate]);

  // Render selected entities for view mode
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

  // Not found state
  if (!currentTask && !isNewTask && state !== StateType.Loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">Görev Bulunamadı</Title>
            <Text type="secondary">Aradığınız görev bulunamadı veya silinmiş olabilir.</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={handleBack}>Listeye Dön</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (state === StateType.Loading && !isNewTask) return null;

  // Render View Mode
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
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleComplete}>Tamamla</Button>
              )}
              {currentTask?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={handleCancelActivity}>İptal Et</Button>
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
                {currentTask?.reminderDateTime ? dayjs(currentTask.reminderDateTime).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Atanan Kişi */}
        <Col span={12}>
          <Card title={<Space><UserOutlined /><span>Atanan Kişi</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentTask?.assignedTo)}
          </Card>
        </Col>

        {/* İlgili Kayıt */}
        <Col span={12}>
          <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentTask?.regardingEntity)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Açıklama</span></Space>} style={{ marginBottom: 16 }}>
            <Paragraph>{currentTask?.description || 'Açıklama girilmemiş.'}</Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Render Edit/Create Mode
  const renderEditMode = () => (
    <Form form={form} layout="vertical" initialValues={{ isActive: true, percentComplete: 0 }}>
      <Row gutter={16}>
        <Col span={24}>
          <Card title={<Space><CheckSquareOutlined /><span>Görev Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="subject" label="Konu" rules={[{ required: true, message: 'Konu gereklidir' }]}>
                  <Input placeholder="Görev konusu girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="isActive" label="Aktif" valuePropName="checked">
                  <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
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
              <Col span={24}>
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
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><CalendarOutlined /><span>Tarih Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startDate" label="Başlangıç Tarihi">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Başlangıç tarihi" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" label="Bitiş Tarihi">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Bitiş tarihi" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="reminderDateTime" label="Hatırlatma">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Hatırlatma tarihi" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Atanan Kişi - Tek Seçimli, Sadece User */}
        <Col span={12}>
          <Card title={<Space><UserOutlined /><span>Atanan Kişi</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item label="Atanacak Kişiyi Seçin">
              <EntityLookup
                value={assignedTo}
                onChange={(value) => setAssignedTo(value as EntityReference | null)}
                entityTypes={['User']}
                multiple={false}
                placeholder="Kişi seçin..."
                onSearch={mockEntitySearch}
                modalTitle="Kişi Seç"
              />
            </Form.Item>
          </Card>
        </Col>

        {/* İlgili Kayıt - Tek Seçimli, Lead/Account/Contact */}
        <Col span={12}>
          <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item label="İlgili Kaydı Seçin">
              <EntityLookup
                value={regarding}
                onChange={(value) => setRegarding(value as EntityReference | null)}
                entityTypes={['Lead', 'Account', 'Contact']}
                multiple={false}
                placeholder="İlgili kayıt seçin..."
                onSearch={mockEntitySearch}
                modalTitle="İlgili Kayıt Seç"
              />
            </Form.Item>
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

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <Tooltip title="Listeye Dön">
                <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
              </Tooltip>
              <Divider type="vertical" />
              <Title level={4} style={{ margin: 0 }}>
                {isNewTask ? 'Yeni Görev' : isViewMode ? 'Görev Detayı' : 'Görev Düzenle'}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNewTask && (
                <>
                  <Popconfirm
                    title="Görev Silme"
                    description="Bu görevi silmek istediğinizden emin misiniz?"
                    onConfirm={handleDelete}
                    okText="Sil"
                    cancelText="İptal"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />}>Sil</Button>
                  </Popconfirm>
                  <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>Düzenle</Button>
                </>
              )}

              {(isEditMode || isCreateMode) && (
                <>
                  <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>İptal</Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    {isNewTask ? 'Oluştur' : 'Kaydet'}
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {isViewMode ? renderViewMode() : renderEditMode()}
    </div>
  );
};

export default TaskDetail;
