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
  DatePicker,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  LinkOutlined,
  BankOutlined,
  IdcardOutlined,
  RocketOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { PhoneCallActivity } from '@/types/activity.types';
import { EntityType } from '@/types/entity.lookup.types';
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
import { StateType, useProcessState } from '@/stores/process.state.store';
import type { EntityTypeValue } from '@/types/entity.lookup.types';
import { entitySearchService } from '@/services/entity.search.service';
import { useSmartBack } from '@/util/useSmartBack';
import EntityLookup from '@/components/EntityLookup';
import { toLocalISO } from '@/util/dateHelper';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export type PhoneCallDetailMode = 'view' | 'edit' | 'create';

export interface PhoneCallDetailProps {
  mode?: PhoneCallDetailMode;
  phoneCallId?: string;
  onModeChange?: (mode: PhoneCallDetailMode) => void;
  onSave?: (phoneCall: PhoneCallActivity) => void;
  onCancel?: () => void;
}

const getEntityIcon = (entityType: EntityTypeValue) => {
  const icons: Record<EntityTypeValue, React.ReactNode> = {
    [EntityType.User]: <UserOutlined />,
    [EntityType.Account]: <BankOutlined />,
    [EntityType.Contact]: <IdcardOutlined />,
    [EntityType.Lead]: <RocketOutlined />,
    [EntityType.Opportunity]: <CalendarOutlined />,
  };
  return icons[entityType];
};

const directionOptions = [
  { label: 'Gelen', value: Direction.Incoming },
  { label: 'Giden', value: Direction.Outgoing },
];

const PhoneCallDetail: React.FC<PhoneCallDetailProps> = (props) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const { state } = useProcessState.getState();

  const urlMode = searchParams.get('mode') as PhoneCallDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<PhoneCallDetailMode>(initialMode);

  const phoneCallId = props.phoneCallId || params.id;
  const isNewPhoneCall = phoneCallId === 'new' || !phoneCallId;

  const {
    currentActivity,
    fetchActivityById,
    createActivity,
    updateActivity,
    setCurrentActivity,
    completeActivity,
    cancelActivity,
  } = useActivityStore();

  const currentPhoneCall = currentActivity as PhoneCallActivity | null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewPhoneCall;

  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isNewPhoneCall && phoneCallId) {
        fetchActivityById(phoneCallId, ActivityType.PhoneCall);
      } else {
        setCurrentActivity(null);
        setMode('create');
      }
    }
  }, [phoneCallId, isNewPhoneCall, fetchActivityById, setCurrentActivity]);

  useEffect(() => {
    const urlMode = searchParams.get('mode') as PhoneCallDetailMode | null;
    if (urlMode && urlMode !== mode && !isNewPhoneCall) {
      setMode(urlMode);
    }
  }, [searchParams, isNewPhoneCall]);

  useEffect(() => {
    if (currentPhoneCall && !isNewPhoneCall) {
      form.setFieldsValue({
        subject: currentPhoneCall.subject,
        direction: currentPhoneCall.direction,
        callNotes: currentPhoneCall.callNotes,
        status: currentPhoneCall.status,
        priority: currentPhoneCall.priority,
        startDate: currentPhoneCall.startDate ? dayjs(currentPhoneCall.startDate) : null,
        dueDate: currentPhoneCall.dueDate ? dayjs(currentPhoneCall.dueDate) : null,
        isActive: currentPhoneCall.isActive,
        caller: currentPhoneCall.caller || null,
        recipient: currentPhoneCall.recipient || null,
        regardingEntity: currentPhoneCall.regardingEntity || null,
      });

    } else if (isNewPhoneCall) {
      form.resetFields();
      form.setFieldsValue({
        direction: Direction.Outgoing,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
      });
    }
  }, [currentPhoneCall, form, isNewPhoneCall]);

  const handleEdit = useCallback(() => {
    updateMode('edit');
  }, [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNewPhoneCall) {
      navigate(RoutePaths.Activity.List);
    } else {
      form.setFieldsValue(currentPhoneCall);
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewPhoneCall, navigate, form, currentPhoneCall, updateMode, props]);


  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    const formattedValues: Partial<PhoneCallActivity> = {
      ...values,
      id: phoneCallId || undefined,
      activityType: ActivityType.PhoneCall,
      startDate: toLocalISO(values.startDate),
      dueDate: toLocalISO(values.dueDate),
    };

    if (isNewPhoneCall) {
      const newPhoneCall = await createActivity<PhoneCallActivity>(formattedValues as any);
      props.onSave?.(newPhoneCall);
      navigate(RoutePaths.Activity.PhoneCall.View(newPhoneCall.id));
    } else if (phoneCallId) {
      const updatedPhoneCall = await updateActivity<PhoneCallActivity>(formattedValues);
      props.onSave?.(updatedPhoneCall);
      updateMode('view');
    }
  }, [form, isNewPhoneCall, phoneCallId, createActivity, updateActivity, navigate, updateMode, props]);

  const handleDelete = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(phoneCallId);
    handleBack();
  }, [phoneCallId, isNewPhoneCall]);

  const handleComplete = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    await completeActivity(phoneCallId);
  }, [phoneCallId, isNewPhoneCall, completeActivity]);

  const handleCancelActivity = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    await cancelActivity(phoneCallId);
  }, [phoneCallId, isNewPhoneCall, cancelActivity]);

  const handleBack = useSmartBack({ fallbackPath: RoutePaths.Activity.List });

  if (!currentPhoneCall && !isNewPhoneCall && state !== StateType.Loading) {
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
                Geri Dön
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (state === StateType.Loading && !isNewPhoneCall) {
    return null;
  }

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
                onClick={handleComplete}
                disabled={currentPhoneCall?.status === ActivityStatus.Completed}
              >
                Tamamlandı
              </Button>
              <Button icon={<CloseCircleOutlined />} onClick={handleCancelActivity} danger>
                İptal Et
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <PhoneOutlined />
                <span>Görüşme Bilgileri</span>
              </Space>
            }
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Arayan">
                {currentPhoneCall?.caller ? (
                  <Space>
                    {getEntityIcon(currentPhoneCall.caller.entityType)}
                    <Text>{currentPhoneCall.caller.name}</Text>
                    {currentPhoneCall.caller.phone && <Text type="secondary">({currentPhoneCall.caller.phone})</Text>}
                  </Space>
                ) : (
                  '-'
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Aranan">
                {currentPhoneCall?.recipient ? (
                  <Space>
                    {getEntityIcon(currentPhoneCall.recipient.entityType)}
                    <Text>{currentPhoneCall.recipient.name}</Text>
                    {currentPhoneCall.recipient.phone && <Text type="secondary">({currentPhoneCall.recipient.phone})</Text>}
                  </Space>
                ) : (
                  '-'
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {currentPhoneCall?.regardingEntity && (
          <Col span={24}>
            <Card
              title={
                <Space>
                  <LinkOutlined />
                  <span>İlgili Kayıt</span>
                </Space>
              }
            >
              <Space>
                {getEntityIcon(currentPhoneCall.regardingEntity.entityType)}
                <Text strong>{currentPhoneCall.regardingEntity.name}</Text>
                <Tag>{currentPhoneCall.regardingEntity.entityType}</Tag>
              </Space>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Görüşme Notları</span>
              </Space>
            }
          >
            <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {currentPhoneCall?.callNotes || 'Not bulunmamaktadır'}
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderEditMode = () => (
    <Form form={form} layout="vertical">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <PhoneOutlined />
                <span>Görüşme Bilgileri</span>
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="subject"
                  label="Konu"
                  rules={[{ required: true, message: 'Konu gereklidir' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Görüşme konusu" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="direction"
                  label="Yön"
                  rules={[{ required: true, message: 'Yön gereklidir' }]}
                >
                  <Select options={directionOptions} />
                </Form.Item>
              </Col>



              <Col span={12}>
                <Form.Item label="Arayan"
                  name="caller"
                  rules={[{ required: true, message: 'Arayan gereklidir' }]}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Lead, EntityType.Contact, EntityType.Account]}
                    multiple={false}
                    modalTitle="Arayan seçin..."
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Aranan"
                  name="recipient"
                  rules={[{ required: true, message: 'Aranan gereklidir' }]}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.User, EntityType.Lead, EntityType.Contact, EntityType.Account]}
                    multiple={false}
                    modalTitle="Aranan seçin..."
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="regardingEntity"
                  label="İlgili Kayıt"
                >
                  <EntityLookup
                    //value={regarding}
                    //onChange={(value) => setRegarding(value as EntityReference | null)}
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
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Durum & Öncelik</span>
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Durum"
                  rules={[{ required: true, message: 'Durum gereklidir' }]}
                >
                  <Select options={activityStatusOptions} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="Öncelik"
                  rules={[{ required: true, message: 'Öncelik gereklidir' }]}
                >
                  <Select options={activityPriorityOptions} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Zaman Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startDate" label="Başlangıç" rules={[{ required: true, message: 'Başlangıç zamanı gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Başlangıç zamanı" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" label="Bitiş" rules={[{ required: true, message: 'Bitiş zamanı gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Bitiş zamanı" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>Görüşme Notları</span>
              </Space>
            }
          >
            <Form.Item name="callNotes" label="Notlar">
              <TextArea rows={6} placeholder="Görüşme notları..." />
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
              <Tooltip title="Geri">
                <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
              </Tooltip>
              <Divider type="vertical" />
              <Title level={4} style={{ margin: 0 }}>
                {isNewPhoneCall ? 'Yeni Telefon Görüşmesi' : isViewMode ? 'Görüşme Detayı' : 'Görüşme Düzenle'}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNewPhoneCall && (
                <>
                  <Popconfirm
                    title="Görüşme Silme"
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

      {isViewMode ? renderViewMode() : renderEditMode()}
    </div>
  );
};

export default PhoneCallDetail;