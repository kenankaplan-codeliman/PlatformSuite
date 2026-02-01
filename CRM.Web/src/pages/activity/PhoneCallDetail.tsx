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
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  FileTextOutlined,
  UserOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { PhoneCallActivity } from '@/types/activity.types';
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
export type PhoneCallDetailMode = 'view' | 'edit' | 'create';

// Props interface for component reuse
export interface PhoneCallDetailProps {
  mode?: PhoneCallDetailMode;
  phoneCallId?: string;
  onModeChange?: (mode: PhoneCallDetailMode) => void;
  onSave?: (phoneCall: PhoneCallActivity) => void;
  onCancel?: () => void;
}

const PhoneCallDetail: React.FC<PhoneCallDetailProps> = (props) => {
  // Router hooks
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  const { state } = useProcessState.getState();

  // Determine mode from props, URL params, or default
  const urlMode = searchParams.get('mode') as PhoneCallDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<PhoneCallDetailMode>(initialMode);

  // Determine phoneCall ID
  const phoneCallId = props.phoneCallId || params.id;
  const isNewPhoneCall = phoneCallId === 'new' || !phoneCallId;

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

  // Cast currentActivity to PhoneCallActivity
  const currentPhoneCall = currentActivity as PhoneCallActivity | null;

  // Computed states
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewPhoneCall;

  // Ref to prevent double fetch
  const isFirstRender = useRef(true);

  // Sync mode with URL
  const updateMode = useCallback(
    (newMode: PhoneCallDetailMode) => {
      setMode(newMode);
      if (!props.mode) {
        setSearchParams({ mode: newMode }, { replace: true });
      }
      props.onModeChange?.(newMode);
    },
    [props, setSearchParams]
  );

  // Fetch phoneCall data on mount (only once)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (!isNewPhoneCall && phoneCallId) {
        fetchActivityById(phoneCallId);
      } else {
        setCurrentActivity(null);
        setMode('create');
      }
    }
  }, [phoneCallId, isNewPhoneCall, fetchActivityById, setCurrentActivity]);

  // Sync mode with URL changes
  useEffect(() => {
    const urlMode = searchParams.get('mode') as PhoneCallDetailMode | null;
    if (urlMode && urlMode !== mode && !isNewPhoneCall) {
      setMode(urlMode);
    }
  }, [searchParams, isNewPhoneCall, mode]);

  // Populate form when phoneCall data changes
  useEffect(() => {
    if (currentPhoneCall && !isNewPhoneCall) {
      form.setFieldsValue({
        ...currentPhoneCall,
        dueDate: currentPhoneCall.dueDate ? dayjs(currentPhoneCall.dueDate) : null,
        actualStart: currentPhoneCall.actualStart ? dayjs(currentPhoneCall.actualStart) : null,
        actualEnd: currentPhoneCall.actualEnd ? dayjs(currentPhoneCall.actualEnd) : null,
      });
    } else if (isNewPhoneCall) {
      form.resetFields();
      // Set default values for new phone call
      form.setFieldsValue({
        activityType: ActivityType.PhoneCall,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        direction: 'Outgoing',
      });
    }
  }, [currentPhoneCall, form, isNewPhoneCall]);

  // Handle mode toggle
  const handleEdit = useCallback(() => {
    updateMode('edit');
  }, [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNewPhoneCall) {
      navigate(RoutePaths.Activity.List);
    } else {
      form.setFieldsValue({
        ...currentPhoneCall,
        dueDate: currentPhoneCall?.dueDate ? dayjs(currentPhoneCall.dueDate) : null,
        actualStart: currentPhoneCall?.actualStart ? dayjs(currentPhoneCall.actualStart) : null,
        actualEnd: currentPhoneCall?.actualEnd ? dayjs(currentPhoneCall.actualEnd) : null,
      });
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewPhoneCall, navigate, form, currentPhoneCall, updateMode, props]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    // Format dates
    const formattedValues = {
      ...values,
      activityType: ActivityType.PhoneCall,
      dueDate: values.dueDate?.toISOString(),
      actualStart: values.actualStart?.toISOString(),
      actualEnd: values.actualEnd?.toISOString(),
    };

    if (isNewPhoneCall) {
      const newPhoneCall = await createActivity<PhoneCallActivity>(formattedValues);
      props.onSave?.(newPhoneCall);
      navigate(RoutePaths.Activity.PhoneCall.View(newPhoneCall.id));
    } else if (phoneCallId) {
      const updatedPhoneCall = await updateActivity<PhoneCallActivity>(phoneCallId, formattedValues);
      props.onSave?.(updatedPhoneCall);
      updateMode('view');
    }
  }, [form, isNewPhoneCall, phoneCallId, createActivity, updateActivity, navigate, updateMode, props]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;

    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(phoneCallId);
    navigate(RoutePaths.Activity.List);
  }, [phoneCallId, isNewPhoneCall, navigate]);

  // Handle complete
  const handleComplete = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    await completeActivity(phoneCallId);
  }, [phoneCallId, isNewPhoneCall, completeActivity]);

  // Handle cancel activity
  const handleCancelActivity = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    await cancelActivity(phoneCallId);
  }, [phoneCallId, isNewPhoneCall, cancelActivity]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(RoutePaths.Activity.List);
  }, [navigate]);

  // Format duration
  const formatDuration = (minutes: number | undefined): string => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} saat ${mins} dakika`;
    }
    return `${mins} dakika`;
  };

  // Not found state
  if (!currentPhoneCall && !isNewPhoneCall) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">
              Telefon Görüşmesi Bulunamadı
            </Title>
            <Text type="secondary">
              Aradığınız telefon görüşmesi bulunamadı veya silinmiş olabilir.
            </Text>
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
  if (state === StateType.Loading && !isNewPhoneCall) {
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
                <PhoneOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Title level={3} style={{ margin: 0 }}>
                  {currentPhoneCall?.subject}
                </Title>
                <Tag color={getActivityStatusColor(currentPhoneCall?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentPhoneCall?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag
                  color={getActivityPriorityColor(currentPhoneCall?.priority ?? ActivityPriority.Normal)}
                  icon={<FlagOutlined />}
                >
                  {getActivityPriorityLabel(currentPhoneCall?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Badge
                  status={currentPhoneCall?.isActive ? 'success' : 'default'}
                  text={currentPhoneCall?.isActive ? 'Aktif' : 'Pasif'}
                />
              </Space>
              {currentPhoneCall?.regardingEntityType && (
                <Text type="secondary">
                  İlgili: {currentPhoneCall.regardingEntityType} - {currentPhoneCall.regardingEntityId}
                </Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              {currentPhoneCall?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleComplete}>
                  Tamamla
                </Button>
              )}
              {currentPhoneCall?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={handleCancelActivity}>
                  İptal Et
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Call Details */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <PhoneOutlined />
                <span>Görüşme Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Arayan">{currentPhoneCall?.caller || '-'}</Descriptions.Item>
              <Descriptions.Item label="Aranan">{currentPhoneCall?.recipient || '-'}</Descriptions.Item>
              <Descriptions.Item label="Telefon No">{currentPhoneCall?.phoneNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="Yön">
                <Tag
                  color={currentPhoneCall?.direction === 'Incoming' ? 'blue' : 'green'}
                  icon={<SwapOutlined />}
                >
                  {currentPhoneCall?.direction === 'Incoming' ? 'Gelen' : 'Giden'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Süre">
                {formatDuration(currentPhoneCall?.durationMinutes)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

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
              <Descriptions.Item label="Planlanan Tarih">
                {currentPhoneCall?.dueDate
                  ? dayjs(currentPhoneCall.dueDate).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Başlangıç">
                {currentPhoneCall?.actualStart
                  ? dayjs(currentPhoneCall.actualStart).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Bitiş">
                {currentPhoneCall?.actualEnd
                  ? dayjs(currentPhoneCall.actualEnd).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Oluşturma Tarihi">
                {currentPhoneCall?.createdAt
                  ? dayjs(currentPhoneCall.createdAt).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Call Notes */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Görüşme Notları</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Paragraph>{currentPhoneCall?.callNotes || 'Not girilmemiş.'}</Paragraph>
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
            <Paragraph>{currentPhoneCall?.description || 'Açıklama girilmemiş.'}</Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  // Render Edit/Create Mode
  const renderEditMode = () => (
    <Form form={form} layout="vertical" initialValues={{ isActive: true, direction: 'Outgoing' }}>
      <Row gutter={16}>
        {/* Basic Info */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <PhoneOutlined />
                <span>Görüşme Bilgileri</span>
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
                  <Input placeholder="Görüşme konusu girin" />
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

        {/* Call Participants */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Katılımcılar</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="caller" label="Arayan">
                  <Input placeholder="Arayan kişi" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="recipient" label="Aranan">
                  <Input placeholder="Aranan kişi" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="phoneNumber" label="Telefon No">
                  <Input prefix={<PhoneOutlined />} placeholder="+90 5XX XXX XX XX" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Status & Direction */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <FlagOutlined />
                <span>Durum & Yön</span>
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
              <Col span={12}>
                <Form.Item name="direction" label="Yön">
                  <Select
                    options={[
                      { label: 'Giden', value: 'Outgoing' },
                      { label: 'Gelen', value: 'Incoming' },
                    ]}
                    placeholder="Yön seçin"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="durationMinutes" label="Süre (dakika)">
                  <InputNumber min={0} style={{ width: '100%' }} placeholder="Süre" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Dates */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Tarih Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="dueDate" label="Planlanan Tarih">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Planlanan tarih"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="actualStart" label="Başlangıç">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Başlangıç tarihi"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="actualEnd" label="Bitiş">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Bitiş tarihi"
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

        {/* Call Notes */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Görüşme Notları</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="callNotes" label="Görüşme Notları">
              <TextArea rows={4} placeholder="Görüşme sırasında alınan notlar..." />
            </Form.Item>
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
              <TextArea rows={4} placeholder="Görüşme hakkında notlar..." />
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
                {isNewPhoneCall
                  ? 'Yeni Telefon Görüşmesi'
                  : isViewMode
                  ? 'Telefon Görüşmesi Detayı'
                  : 'Telefon Görüşmesi Düzenle'}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNewPhoneCall && (
                <>
                  <Popconfirm
                    title="Telefon Görüşmesi Silme"
                    description="Bu telefon görüşmesini silmek istediğinizden emin misiniz?"
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
                    {isNewPhoneCall ? 'Oluştur' : 'Kaydet'}
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

export default PhoneCallDetail;
