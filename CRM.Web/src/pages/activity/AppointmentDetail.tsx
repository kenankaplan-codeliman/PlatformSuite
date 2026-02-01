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
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
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
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AppointmentActivity } from '@/types/activity.types';
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
export type AppointmentDetailMode = 'view' | 'edit' | 'create';

// Props interface for component reuse
export interface AppointmentDetailProps {
  mode?: AppointmentDetailMode;
  appointmentId?: string;
  onModeChange?: (mode: AppointmentDetailMode) => void;
  onSave?: (appointment: AppointmentActivity) => void;
  onCancel?: () => void;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = (props) => {
  // Router hooks
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  const { state } = useProcessState.getState();

  // Determine mode from props, URL params, or default
  const urlMode = searchParams.get('mode') as AppointmentDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<AppointmentDetailMode>(initialMode);

  // Determine appointment ID
  const appointmentId = props.appointmentId || params.id;
  const isNewAppointment = appointmentId === 'new' || !appointmentId;

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

  // Cast currentActivity to AppointmentActivity
  const currentAppointment = currentActivity as AppointmentActivity | null;

  // Computed states
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewAppointment;

  // Ref to prevent double fetch
  const isFirstRender = useRef(true);

  // Sync mode with URL
  const updateMode = useCallback(
    (newMode: AppointmentDetailMode) => {
      setMode(newMode);
      if (!props.mode) {
        setSearchParams({ mode: newMode }, { replace: true });
      }
      props.onModeChange?.(newMode);
    },
    [props, setSearchParams]
  );

  // Fetch appointment data on mount (only once)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (!isNewAppointment && appointmentId) {
        fetchActivityById(appointmentId);
      } else {
        setCurrentActivity(null);
        setMode('create');
      }
    }
  }, [appointmentId, isNewAppointment, fetchActivityById, setCurrentActivity]);

  // Sync mode with URL changes
  useEffect(() => {
    const urlMode = searchParams.get('mode') as AppointmentDetailMode | null;
    if (urlMode && urlMode !== mode && !isNewAppointment) {
      setMode(urlMode);
    }
  }, [searchParams, isNewAppointment, mode]);

  // Populate form when appointment data changes
  useEffect(() => {
    if (currentAppointment && !isNewAppointment) {
      form.setFieldsValue({
        ...currentAppointment,
        dueDate: currentAppointment.dueDate ? dayjs(currentAppointment.dueDate) : null,
        startTime: currentAppointment.startTime ? dayjs(currentAppointment.startTime) : null,
        endTime: currentAppointment.endTime ? dayjs(currentAppointment.endTime) : null,
      });
    } else if (isNewAppointment) {
      form.resetFields();
      // Set default values for new appointment
      form.setFieldsValue({
        activityType: ActivityType.Appointment,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        isAllDayEvent: false,
      });
    }
  }, [currentAppointment, form, isNewAppointment]);

  // Handle mode toggle
  const handleEdit = useCallback(() => {
    updateMode('edit');
  }, [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNewAppointment) {
      navigate(RoutePaths.Activity.List);
    } else {
      form.setFieldsValue({
        ...currentAppointment,
        dueDate: currentAppointment?.dueDate ? dayjs(currentAppointment.dueDate) : null,
        startTime: currentAppointment?.startTime ? dayjs(currentAppointment.startTime) : null,
        endTime: currentAppointment?.endTime ? dayjs(currentAppointment.endTime) : null,
      });
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewAppointment, navigate, form, currentAppointment, updateMode, props]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    // Format dates
    const formattedValues = {
      ...values,
      activityType: ActivityType.Appointment,
      dueDate: values.dueDate?.toISOString(),
      startTime: values.startTime?.toISOString(),
      endTime: values.endTime?.toISOString(),
    };

    if (isNewAppointment) {
      const newAppointment = await createActivity<AppointmentActivity>(formattedValues);
      props.onSave?.(newAppointment);
      navigate(RoutePaths.Activity.Appointment.View(newAppointment.id));
    } else if (appointmentId) {
      const updatedAppointment = await updateActivity<AppointmentActivity>(
        appointmentId,
        formattedValues
      );
      props.onSave?.(updatedAppointment);
      updateMode('view');
    }
  }, [form, isNewAppointment, appointmentId, createActivity, updateActivity, navigate, updateMode, props]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!appointmentId || isNewAppointment) return;

    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(appointmentId);
    navigate(RoutePaths.Activity.List);
  }, [appointmentId, isNewAppointment, navigate]);

  // Handle complete
  const handleComplete = useCallback(async () => {
    if (!appointmentId || isNewAppointment) return;
    await completeActivity(appointmentId);
  }, [appointmentId, isNewAppointment, completeActivity]);

  // Handle cancel activity
  const handleCancelActivity = useCallback(async () => {
    if (!appointmentId || isNewAppointment) return;
    await cancelActivity(appointmentId);
  }, [appointmentId, isNewAppointment, cancelActivity]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(RoutePaths.Activity.List);
  }, [navigate]);

  // Not found state
  if (!currentAppointment && !isNewAppointment) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">
              Randevu Bulunamadı
            </Title>
            <Text type="secondary">Aradığınız randevu bulunamadı veya silinmiş olabilir.</Text>
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
  if (state === StateType.Loading && !isNewAppointment) {
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
                <CalendarOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                <Title level={3} style={{ margin: 0 }}>
                  {currentAppointment?.subject}
                </Title>
                <Tag
                  color={getActivityStatusColor(currentAppointment?.status ?? ActivityStatus.NotStarted)}
                >
                  {getActivityStatusLabel(currentAppointment?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag
                  color={getActivityPriorityColor(currentAppointment?.priority ?? ActivityPriority.Normal)}
                  icon={<FlagOutlined />}
                >
                  {getActivityPriorityLabel(currentAppointment?.priority ?? ActivityPriority.Normal)}
                </Tag>
                {currentAppointment?.isAllDayEvent && <Tag color="purple">Tüm Gün</Tag>}
                <Badge
                  status={currentAppointment?.isActive ? 'success' : 'default'}
                  text={currentAppointment?.isActive ? 'Aktif' : 'Pasif'}
                />
              </Space>
              {currentAppointment?.regardingEntityType && (
                <Text type="secondary">
                  İlgili: {currentAppointment.regardingEntityType} - {currentAppointment.regardingEntityId}
                </Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              {currentAppointment?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleComplete}>
                  Tamamla
                </Button>
              )}
              {currentAppointment?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={handleCancelActivity}>
                  İptal Et
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Appointment Details */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Zaman Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Başlangıç">
                {currentAppointment?.startTime
                  ? dayjs(currentAppointment.startTime).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bitiş">
                {currentAppointment?.endTime
                  ? dayjs(currentAppointment.endTime).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Tüm Gün">
                <Badge
                  status={currentAppointment?.isAllDayEvent ? 'success' : 'default'}
                  text={currentAppointment?.isAllDayEvent ? 'Evet' : 'Hayır'}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                <span>Konum & Toplantı</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Konum">{currentAppointment?.location || '-'}</Descriptions.Item>
              <Descriptions.Item label="Organizatör">
                {currentAppointment?.organizer || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Toplantı Linki">
                {currentAppointment?.meetingUrl ? (
                  <a href={currentAppointment.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <Space>
                      <LinkOutlined />
                      Toplantıya Katıl
                    </Space>
                  </a>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Attendees */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Katılımcılar</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Paragraph>
              {currentAppointment?.attendees || 'Katılımcı bilgisi girilmemiş.'}
            </Paragraph>
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
            <Paragraph>{currentAppointment?.description || 'Açıklama girilmemiş.'}</Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Render Edit/Create Mode
  const renderEditMode = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ isActive: true, isAllDayEvent: false }}
    >
      <Row gutter={16}>
        {/* Basic Info */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <CalendarOutlined />
                <span>Randevu Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="subject"
                  label="Konu"
                  rules={[{ required: true, message: 'Konu gereklidir' }]}
                >
                  <Input placeholder="Randevu konusu girin" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="isActive" label="Aktif" valuePropName="checked">
                  <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="isAllDayEvent" label="Tüm Gün" valuePropName="checked">
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
            </Row>
          </Card>
        </Col>

        {/* Time */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Zaman Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startTime" label="Başlangıç">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Başlangıç zamanı"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endTime" label="Bitiş">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Bitiş zamanı"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Location & Meeting */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                <span>Konum & Toplantı</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="location" label="Konum">
                  <Input prefix={<EnvironmentOutlined />} placeholder="Toplantı konumu" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="organizer" label="Organizatör">
                  <Input prefix={<UserOutlined />} placeholder="Organizatör" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="meetingUrl" label="Toplantı Linki">
                  <Input prefix={<LinkOutlined />} placeholder="https://meet.google.com/..." />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Attendees */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Katılımcılar</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="attendees" label="Katılımcılar">
              <TextArea rows={3} placeholder="Katılımcıları virgülle ayırarak girin..." />
            </Form.Item>
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
              <TextArea rows={4} placeholder="Randevu hakkında notlar..." />
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
                {isNewAppointment
                  ? 'Yeni Randevu'
                  : isViewMode
                  ? 'Randevu Detayı'
                  : 'Randevu Düzenle'}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNewAppointment && (
                <>
                  <Popconfirm
                    title="Randevu Silme"
                    description="Bu randevuyu silmek istediğinizden emin misiniz?"
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
                    {isNewAppointment ? 'Oluştur' : 'Kaydet'}
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

export default AppointmentDetail;
