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
  LinkOutlined,
  BankOutlined,
  IdcardOutlined,
  RocketOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { PhoneCallActivity } from '@/types/activity.types';
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
export type PhoneCallDetailMode = 'view' | 'edit' | 'create';

// Props interface
export interface PhoneCallDetailProps {
  mode?: PhoneCallDetailMode;
  phoneCallId?: string;
  onModeChange?: (mode: PhoneCallDetailMode) => void;
  onSave?: (phoneCall: PhoneCallActivity) => void;
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

const PhoneCallDetail: React.FC<PhoneCallDetailProps> = (props) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  const { state } = useProcessState.getState();

  const urlMode = searchParams.get('mode') as PhoneCallDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<PhoneCallDetailMode>(initialMode);

  // Lookup field states - EntityReference tipinde
  const [caller, setCaller] = useState<EntityReference | null>(null);
  const [recipient, setRecipient] = useState<EntityReference | null>(null);
  const [regarding, setRegarding] = useState<EntityReference | null>(null);

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
  }, [searchParams, isNewPhoneCall, mode]);

  useEffect(() => {
    if (currentPhoneCall && !isNewPhoneCall) {
      form.setFieldsValue({
        ...currentPhoneCall,
        dueDate: currentPhoneCall.dueDate ? dayjs(currentPhoneCall.dueDate) : null,
        actualStart: currentPhoneCall.actualStart ? dayjs(currentPhoneCall.actualStart) : null,
        actualEnd: currentPhoneCall.actualEnd ? dayjs(currentPhoneCall.actualEnd) : null,
      });

      setCaller(currentPhoneCall.caller || null);
      setRecipient(currentPhoneCall.recipient || null);
      setRegarding(currentPhoneCall.regarding || null);
    } else if (isNewPhoneCall) {
      form.resetFields();
      setCaller(null);
      setRecipient(null);
      setRegarding(null);
      form.setFieldsValue({
        activityType: ActivityType.PhoneCall,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        direction: 'Outgoing',
      });
    }
  }, [currentPhoneCall, form, isNewPhoneCall]);

  const handleEdit = useCallback(() => updateMode('edit'), [updateMode]);

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
      setCaller(currentPhoneCall?.caller || null);
      setRecipient(currentPhoneCall?.recipient || null);
      setRegarding(currentPhoneCall?.regarding || null);
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewPhoneCall, navigate, form, currentPhoneCall, updateMode, props]);

  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    const formattedValues: Partial<PhoneCallActivity> = {
      ...values,
      activityType: ActivityType.PhoneCall,
      dueDate: values.dueDate?.toISOString(),
      actualStart: values.actualStart?.toISOString(),
      actualEnd: values.actualEnd?.toISOString(),
      caller: caller,
      recipient: recipient,
      regarding: regarding,
      regardingEntityType: regarding?.entityType || null,
      regardingEntityId: regarding?.id || null,
    };

    if (isNewPhoneCall) {
      const newPhoneCall = await createActivity<PhoneCallActivity>(formattedValues as any);
      props.onSave?.(newPhoneCall);
      navigate(RoutePaths.Activity.PhoneCall.View(newPhoneCall.id));
    } else if (phoneCallId) {
      const updatedPhoneCall = await updateActivity<PhoneCallActivity>(phoneCallId, formattedValues);
      props.onSave?.(updatedPhoneCall);
      updateMode('view');
    }
  }, [form, isNewPhoneCall, phoneCallId, createActivity, updateActivity, navigate, updateMode, props, caller, recipient, regarding]);

  const handleDelete = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(phoneCallId);
    navigate(RoutePaths.Activity.List);
  }, [phoneCallId, isNewPhoneCall, navigate]);

  const handleComplete = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    await completeActivity(phoneCallId);
  }, [phoneCallId, isNewPhoneCall, completeActivity]);

  const handleCancelActivity = useCallback(async () => {
    if (!phoneCallId || isNewPhoneCall) return;
    await cancelActivity(phoneCallId);
  }, [phoneCallId, isNewPhoneCall, cancelActivity]);

  const handleBack = useCallback(() => navigate(RoutePaths.Activity.List), [navigate]);

  const formatDuration = (minutes: number | undefined): string => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} saat ${mins} dakika`;
    }
    return `${mins} dakika`;
  };

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

  if (!currentPhoneCall && !isNewPhoneCall && state !== StateType.Loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">Telefon Görüşmesi Bulunamadı</Title>
            <Text type="secondary">Aradığınız telefon görüşmesi bulunamadı veya silinmiş olabilir.</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={handleBack}>Listeye Dön</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (state === StateType.Loading && !isNewPhoneCall) return null;

  const renderViewMode = () => (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Space align="center" wrap>
                <PhoneOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <Title level={3} style={{ margin: 0 }}>{currentPhoneCall?.subject}</Title>
                <Tag color={getActivityStatusColor(currentPhoneCall?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentPhoneCall?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag color={getActivityPriorityColor(currentPhoneCall?.priority ?? ActivityPriority.Normal)} icon={<FlagOutlined />}>
                  {getActivityPriorityLabel(currentPhoneCall?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Tag color={currentPhoneCall?.direction === 'Incoming' ? 'blue' : 'green'} icon={<SwapOutlined />}>
                  {currentPhoneCall?.direction === 'Incoming' ? 'Gelen' : 'Giden'}
                </Tag>
                <Badge status={currentPhoneCall?.isActive ? 'success' : 'default'} text={currentPhoneCall?.isActive ? 'Aktif' : 'Pasif'} />
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              {currentPhoneCall?.status !== ActivityStatus.Completed && (
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleComplete}>Tamamla</Button>
              )}
              {currentPhoneCall?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={handleCancelActivity}>İptal Et</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><PhoneOutlined /><span>Görüşme Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Arayan">{renderSelectedEntities(currentPhoneCall?.caller)}</Descriptions.Item>
              <Descriptions.Item label="Aranan">{renderSelectedEntities(currentPhoneCall?.recipient)}</Descriptions.Item>
              <Descriptions.Item label="Telefon No">{currentPhoneCall?.phoneNumber || '-'}</Descriptions.Item>
              <Descriptions.Item label="Süre">{formatDuration(currentPhoneCall?.durationMinutes)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Tarih Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Planlanan Tarih">{currentPhoneCall?.dueDate ? dayjs(currentPhoneCall.dueDate).format('DD.MM.YYYY HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Başlangıç">{currentPhoneCall?.actualStart ? dayjs(currentPhoneCall.actualStart).format('DD.MM.YYYY HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Bitiş">{currentPhoneCall?.actualEnd ? dayjs(currentPhoneCall.actualEnd).format('DD.MM.YYYY HH:mm') : '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>} style={{ marginBottom: 16 }}>
            {renderSelectedEntities(currentPhoneCall?.regarding)}
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Görüşme Notları</span></Space>} style={{ marginBottom: 16 }}>
            <Paragraph>{currentPhoneCall?.callNotes || 'Not girilmemiş.'}</Paragraph>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Açıklama</span></Space>} style={{ marginBottom: 16 }}>
            <Paragraph>{currentPhoneCall?.description || 'Açıklama girilmemiş.'}</Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderEditMode = () => (
    <Form form={form} layout="vertical" initialValues={{ isActive: true, direction: 'Outgoing' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Card title={<Space><PhoneOutlined /><span>Görüşme Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="subject" label="Konu" rules={[{ required: true, message: 'Konu gereklidir' }]}>
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

        {/* Arayan - Tek Seçimli */}
        <Col span={12}>
          <Card title={<Space><UserOutlined /><span>Arayan</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item label="Arayan Seçin">
              <EntityLookup
                value={caller}
                onChange={(value) => setCaller(value as EntityReference | null)}
                entityTypes={['User', 'Contact']}
                multiple={false}
                placeholder="Arayan seçin..."
                onSearch={mockEntitySearch}
                modalTitle="Arayan Seç"
              />
            </Form.Item>
          </Card>
        </Col>

        {/* Aranan - Tek Seçimli */}
        <Col span={12}>
          <Card title={<Space><UserOutlined /><span>Aranan</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item label="Aranan Seçin">
              <EntityLookup
                value={recipient}
                onChange={(value) => setRecipient(value as EntityReference | null)}
                entityTypes={['User', 'Contact', 'Account']}
                multiple={false}
                placeholder="Aranan seçin..."
                onSearch={mockEntitySearch}
                modalTitle="Aranan Seç"
              />
            </Form.Item>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><PhoneOutlined /><span>Telefon & Yön</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="phoneNumber" label="Telefon No">
                  <Input prefix={<PhoneOutlined />} placeholder="+90 5XX XXX XX XX" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="direction" label="Yön">
                  <Select options={[{ label: 'Giden', value: 'Outgoing' }, { label: 'Gelen', value: 'Incoming' }]} placeholder="Yön seçin" />
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
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><ClockCircleOutlined /><span>Tarih Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="dueDate" label="Planlanan Tarih">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Planlanan tarih" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="actualStart" label="Başlangıç">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Başlangıç tarihi" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="actualEnd" label="Bitiş">
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Bitiş tarihi" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* İlgili Kayıt */}
        <Col span={24}>
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
          <Card title={<Space><FileTextOutlined /><span>Görüşme Notları</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="callNotes" label="Görüşme Notları">
              <TextArea rows={4} placeholder="Görüşme sırasında alınan notlar..." />
            </Form.Item>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Açıklama</span></Space>} style={{ marginBottom: 16 }}>
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
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <Tooltip title="Listeye Dön">
                <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
              </Tooltip>
              <Divider type="vertical" />
              <Title level={4} style={{ margin: 0 }}>
                {isNewPhoneCall ? 'Yeni Telefon Görüşmesi' : isViewMode ? 'Telefon Görüşmesi Detayı' : 'Telefon Görüşmesi Düzenle'}
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
                    <Button danger icon={<DeleteOutlined />}>Sil</Button>
                  </Popconfirm>
                  <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>Düzenle</Button>
                </>
              )}

              {(isEditMode || isCreateMode) && (
                <>
                  <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>İptal</Button>
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
