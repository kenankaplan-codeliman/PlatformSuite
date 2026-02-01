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
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TaskActivity } from '@/types/activity.types';
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

const TaskDetail: React.FC<TaskDetailProps> = (props) => {
  // Router hooks
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  const { state } = useProcessState.getState();

  // Determine mode from props, URL params, or default
  const urlMode = searchParams.get('mode') as TaskDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<TaskDetailMode>(initialMode);

  // Determine task ID
  const taskId = props.taskId || params.id;
  const isNewTask = taskId === 'new' || !taskId;

  // Store state and actions
  const {
    currentActivity,
    fetchActivityById,
    createActivity,
    updateActivity,
    setCurrentActivity,
    completeActivity,
    cancelActivity,
  } = useActivityStore();

  // Cast currentActivity to TaskActivity
  const currentTask = currentActivity as TaskActivity | null;

  // Computed states
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewTask;

  // Ref to prevent double fetch
  const isFirstRender = useRef(true);

  // Sync mode with URL
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

  // Fetch task data on mount (only once)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (!isNewTask && taskId) {
        fetchActivityById(taskId);
      } else {
        setCurrentActivity(null);
        setMode('create');
      }
    }
  }, [taskId, isNewTask, fetchActivityById, setCurrentActivity]);

  // Sync mode with URL changes
  useEffect(() => {
    const urlMode = searchParams.get('mode') as TaskDetailMode | null;
    if (urlMode && urlMode !== mode && !isNewTask) {
      setMode(urlMode);
    }
  }, [searchParams, isNewTask, mode]);

  // Populate form when task data changes
  useEffect(() => {
    if (currentTask && !isNewTask) {
      form.setFieldsValue({
        ...currentTask,
        dueDate: currentTask.dueDate ? dayjs(currentTask.dueDate) : null,
        startDate: currentTask.startDate ? dayjs(currentTask.startDate) : null,
        reminderDateTime: currentTask.reminderDateTime ? dayjs(currentTask.reminderDateTime) : null,
      });
    } else if (isNewTask) {
      form.resetFields();
      // Set default values for new task
      form.setFieldsValue({
        activityType: ActivityType.Task,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        percentComplete: 0,
      });
    }
  }, [currentTask, form, isNewTask]);

  // Handle mode toggle
  const handleEdit = useCallback(() => {
    updateMode('edit');
  }, [updateMode]);

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
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewTask, navigate, form, currentTask, updateMode, props]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    // Format dates
    const formattedValues = {
      ...values,
      activityType: ActivityType.Task,
      dueDate: values.dueDate?.toISOString(),
      startDate: values.startDate?.toISOString(),
      reminderDateTime: values.reminderDateTime?.toISOString(),
    };

    if (isNewTask) {
      const newTask = await createActivity<TaskActivity>(formattedValues);
      props.onSave?.(newTask);
      navigate(RoutePaths.Activity.Task.View(newTask.id));
    } else if (taskId) {
      const updatedTask = await updateActivity<TaskActivity>(taskId, formattedValues);
      props.onSave?.(updatedTask);
      updateMode('view');
    }
  }, [form, isNewTask, taskId, createActivity, updateActivity, navigate, updateMode, props]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!taskId || isNewTask) return;

    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(taskId);
    navigate(RoutePaths.Activity.List);
  }, [taskId, isNewTask, navigate]);

  // Handle complete
  const handleComplete = useCallback(async () => {
    if (!taskId || isNewTask) return;
    await completeActivity(taskId);
  }, [taskId, isNewTask, completeActivity]);

  // Handle cancel activity
  const handleCancelActivity = useCallback(async () => {
    if (!taskId || isNewTask) return;
    await cancelActivity(taskId);
  }, [taskId, isNewTask, cancelActivity]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(RoutePaths.Activity.List);
  }, [navigate]);

  // Not found state
  if (!currentTask && !isNewTask) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">
              Görev Bulunamadı
            </Title>
            <Text type="secondary">Aradığınız görev bulunamadı veya silinmiş olabilir.</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={handleBack}>
                Listeye Dön
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Don't render content while loading
  if (state === StateType.Loading && !isNewTask) {
    return null;
  }

  // Render View Mode
  const renderViewMode = () => (
    <>
      {/* Header Info */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space orientation="vertical" size={4}>
              <Space align="center">
                <CheckSquareOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <Title level={3} style={{ margin: 0 }}>
                  {currentTask?.subject}
                </Title>
                <Tag color={getActivityStatusColor(currentTask?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentTask?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag
                  color={getActivityPriorityColor(currentTask?.priority ?? ActivityPriority.Normal)}
                  icon={<FlagOutlined />}
                >
                  {getActivityPriorityLabel(currentTask?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Badge
                  status={currentTask?.isActive ? 'success' : 'default'}
                  text={currentTask?.isActive ? 'Aktif' : 'Pasif'}
                />
              </Space>
              {currentTask?.regardingEntityType && (
                <Text type="secondary">
                  İlgili: {currentTask.regardingEntityType} - {currentTask.regardingEntityId}
                </Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              {currentTask?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleComplete}>
                  Tamamla
                </Button>
              )}
              {currentTask?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={handleCancelActivity}>
                  İptal Et
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Progress */}
      {currentTask?.percentComplete !== undefined && (
        <Card style={{ marginBottom: 16 }}>
          <Row align="middle" gutter={16}>
            <Col flex="auto">
              <Text strong>İlerleme Durumu</Text>
              <Progress
                percent={currentTask.percentComplete}
                status={
                  currentTask.percentComplete === 100
                    ? 'success'
                    : currentTask.status === ActivityStatus.Cancelled
                    ? 'exception'
                    : 'active'
                }
                style={{ marginTop: 8 }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Details */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Tarih Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Başlangıç Tarihi">
                {currentTask?.startDate ? dayjs(currentTask.startDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bitiş Tarihi">
                {currentTask?.dueDate ? dayjs(currentTask.dueDate).format('DD.MM.YYYY HH:mm') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Hatırlatma">
                {currentTask?.reminderDateTime
                  ? dayjs(currentTask.reminderDateTime).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Atama Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Sahip">
                {currentTask?.ownerId || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Oluşturan">
                {currentTask?.createdBy || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Oluşturma Tarihi">
                {currentTask?.createdAt
                  ? dayjs(currentTask.createdAt).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Description */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Açıklama</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
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
        {/* Basic Info */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <CheckSquareOutlined />
                <span>Görev Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="subject"
                  label="Konu"
                  rules={[{ required: true, message: 'Konu gereklidir' }]}
                >
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

        {/* Status & Priority */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <FlagOutlined />
                <span>Durum & Öncelik</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Durum"
                  rules={[{ required: true, message: 'Durum seçimi gereklidir' }]}
                >
                  <Select options={activityStatusOptions} placeholder="Durum seçin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="Öncelik"
                  rules={[{ required: true, message: 'Öncelik seçimi gereklidir' }]}
                >
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

        {/* Dates */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <CalendarOutlined />
                <span>Tarih Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startDate" label="Başlangıç Tarihi">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Başlangıç tarihi"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" label="Bitiş Tarihi">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Bitiş tarihi"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="reminderDateTime" label="Hatırlatma">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Hatırlatma tarihi"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Regarding Entity */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>İlgili Kayıt</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="regardingEntityType" label="Kayıt Tipi">
                  <Select
                    allowClear
                    placeholder="Kayıt tipi seçin"
                    options={[
                      { label: 'Lead', value: 'Lead' },
                      { label: 'Müşteri', value: 'Account' },
                      { label: 'Kişi', value: 'Contact' },
                      { label: 'Fırsat', value: 'Opportunity' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="regardingEntityId" label="Kayıt ID">
                  <Input placeholder="İlgili kayıt ID" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Description */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Açıklama</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
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
      {/* Page Header */}
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
                    <Button danger icon={<DeleteOutlined />}>
                      Sil
                    </Button>
                  </Popconfirm>
                  <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                    Düzenle
                  </Button>
                </>
              )}

              {(isEditMode || isCreateMode) && (
                <>
                  <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
                    İptal
                  </Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    {isNewTask ? 'Oluştur' : 'Kaydet'}
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Content */}
      {isViewMode ? renderViewMode() : renderEditMode()}
    </div>
  );
};

export default TaskDetail;
