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
  BankOutlined,
  IdcardOutlined,
  RocketOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AppointmentActivity } from '@/types/activity.types';
import type { EntityReference } from '@/types/entity.lookup.types';
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
import type { EntityType as LookupEntityType } from '@/types/entity.lookup.types';
import { entitySearchService } from '@/services/entity.search.service';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Page mode type
export type AppointmentDetailMode = 'view' | 'edit' | 'create';

// Props interface
export interface AppointmentDetailProps {
  mode?: AppointmentDetailMode;
  appointmentId?: string;
  onModeChange?: (mode: AppointmentDetailMode) => void;
  onSave?: (appointment: AppointmentActivity) => void;
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

const AppointmentDetail: React.FC<AppointmentDetailProps> = (props) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const { state } = useProcessState.getState();

  const urlMode = searchParams.get('mode') as AppointmentDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<AppointmentDetailMode>(initialMode);

  // Lookup field states - EntityReference tipinde
  const [organizer, setOrganizer] = useState<EntityReference | null>(null);
  const [attendees, setAttendees] = useState<EntityReference[]>([]);
  const [regarding, setRegarding] = useState<EntityReference | null>(null);

  const appointmentId = props.appointmentId || params.id;
  const isNewAppointment = appointmentId === 'new' || !appointmentId;

  const {
    currentActivity,
    fetchActivityById,
    createActivity,
    updateActivity,
    setCurrentActivity,
    completeActivity,
    cancelActivity,
  } = useActivityStore();

  const currentAppointment = currentActivity as AppointmentActivity | null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewAppointment;

  const isFirstRender = useRef(true);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isNewAppointment && appointmentId) {
        fetchActivityById(appointmentId, ActivityType.Appointment);
      } else {
        setCurrentActivity(null);
        setMode('create');
      }
    }
  }, [appointmentId, isNewAppointment, fetchActivityById, setCurrentActivity]);

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
        startTime: currentAppointment.startTime ? dayjs(currentAppointment.startTime) : null,
        endTime: currentAppointment.endTime ? dayjs(currentAppointment.endTime) : null,
      });

      // Set EntityReference fields directly (already correct type from backend)
      setOrganizer(currentAppointment.organizer || null);
      setAttendees(currentAppointment.attendees || []);
      setRegarding(currentAppointment.regarding || null);
    } else if (isNewAppointment) {
      form.resetFields();
      setOrganizer(null);
      setAttendees([]);
      setRegarding(null);
      form.setFieldsValue({
        activityType: ActivityType.Appointment,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        isAllDay: false,
        isOnline: false,
        isRecurring: false,
      });
    }
  }, [currentAppointment, form, isNewAppointment]);

  const handleEdit = useCallback(() => updateMode('edit'), [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNewAppointment) {
      navigate(RoutePaths.Activity.List);
    } else {
      form.setFieldsValue({
        ...currentAppointment,
        startTime: currentAppointment?.startTime ? dayjs(currentAppointment.startTime) : null,
        endTime: currentAppointment?.endTime ? dayjs(currentAppointment.endTime) : null,
      });
      setOrganizer(currentAppointment?.organizer || null);
      setAttendees(currentAppointment?.attendees || []);
      setRegarding(currentAppointment?.regarding || null);
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewAppointment, navigate, form, currentAppointment, updateMode, props]);

  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    // EntityReference alanları doğrudan gönderiliyor (serialize etmeye gerek yok)
    const formattedValues: Partial<AppointmentActivity> = {
      ...values,
      activityType: ActivityType.Appointment,
      startTime: values.startTime?.toISOString(),
      endTime: values.endTime?.toISOString(),
      organizer: organizer,
      attendees: attendees,
      regarding: regarding,
      // Ayrıca flat alanlar da güncellenebilir (backend uyumu için)
      regardingEntityType: regarding?.entityType || null,
      regardingEntityId: regarding?.id || null,
    };

    if (isNewAppointment) {
      const newAppointment = await createActivity<AppointmentActivity>(formattedValues as any);
      props.onSave?.(newAppointment);
      navigate(RoutePaths.Activity.Appointment.View(newAppointment.id));
    } else if (appointmentId) {
      const updatedAppointment = await updateActivity<AppointmentActivity>(appointmentId, formattedValues);
      props.onSave?.(updatedAppointment);
      updateMode('view');
    }
  }, [form, isNewAppointment, appointmentId, createActivity, updateActivity, navigate, updateMode, props, organizer, attendees, regarding]);

  const handleDelete = useCallback(async () => {
    if (!appointmentId || isNewAppointment) return;
    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(appointmentId);
    navigate(RoutePaths.Activity.List);
  }, [appointmentId, isNewAppointment, navigate]);

  const handleComplete = useCallback(async () => {
    if (!appointmentId || isNewAppointment) return;
    await completeActivity(appointmentId);
  }, [appointmentId, isNewAppointment, completeActivity]);

  const handleCancelActivity = useCallback(async () => {
    if (!appointmentId || isNewAppointment) return;
    await cancelActivity(appointmentId);
  }, [appointmentId, isNewAppointment, cancelActivity]);

  const handleBack = useCallback(() => navigate(RoutePaths.Activity.List), [navigate]);

  // Not found state
  if (!currentAppointment && !isNewAppointment && state !== StateType.Loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">Randevu Bulunamadı</Title>
            <Text type="secondary">Aradığınız randevu bulunamadı veya silinmiş olabilir.</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={handleBack}>Listeye Dön</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (state === StateType.Loading && !isNewAppointment) return null;

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

  // Render View Mode
  const renderViewMode = () => (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
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
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleComplete}>Tamamla</Button>
              )}
              {currentAppointment?.status !== ActivityStatus.Cancelled && (
                <Button icon={<CloseCircleOutlined />} onClick={handleCancelActivity}>İptal Et</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Zaman Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Başlangıç">{currentAppointment?.startTime ? dayjs(currentAppointment.startTime).format('DD.MM.YYYY HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Bitiş">{currentAppointment?.endTime ? dayjs(currentAppointment.endTime).format('DD.MM.YYYY HH:mm') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Tüm Gün"><Badge status={currentAppointment?.isAllDay ? 'success' : 'default'} text={currentAppointment?.isAllDay ? 'Evet' : 'Hayır'} /></Descriptions.Item>
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
            {renderSelectedEntities(currentAppointment?.regarding)}
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

  // Render Edit/Create Mode
  const renderEditMode = () => (
    <Form form={form} layout="vertical" initialValues={{ isActive: true, isAllDay: false, isOnline: false, isRecurring: false }}>
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
                <Form.Item name="isActive" label="Aktif" valuePropName="checked">
                  <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="isAllDay" label="Tüm Gün" valuePropName="checked">
                  <Switch checkedChildren="Evet" unCheckedChildren="Hayır" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="isOnline" label="Online" valuePropName="checked">
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
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Zaman Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="startTime" label="Başlangıç" rules={[{ required: true, message: 'Başlangıç zamanı gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Başlangıç zamanı" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endTime" label="Bitiş" rules={[{ required: true, message: 'Bitiş zamanı gereklidir' }]}>
                  <DatePicker showTime format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Bitiş zamanı" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Space><EnvironmentOutlined /><span>Konum & Toplantı</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="location" label="Konum">
                  <Input prefix={<EnvironmentOutlined />} placeholder="Toplantı konumu" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="meetingUrl" label="Toplantı Linki">
                  <Input prefix={<LinkOutlined />} placeholder="https://meet.google.com/..." />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="reminderMinutesBefore" label="Hatırlatma (dakika)">
                  <Space.Compact>
                    <InputNumber min={0} max={10080} style={{ width: '100%' }} placeholder="Örn: 15" />
                    <span style={{ padding: '0 8px', lineHeight: '32px' }}>dk</span>
                  </Space.Compact>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Organizatör - Tek Seçimli, Sadece User */}
        <Col span={12}>
          <Card title={<Space><UserOutlined /><span>Organizatör</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item label="Organizatör Seçin">
              <EntityLookup
                value={organizer}
                onChange={(value) => setOrganizer(value as EntityReference | null)}
                entityTypes={['User']}
                multiple={false}
                placeholder="Organizatör seçin..."
                onSearch={entitySearchService.search}
                modalTitle="Organizatör Seç"
              />
            </Form.Item>
          </Card>
        </Col>

        {/* Katılımcılar - Çoklu Seçimli, User/Account/Contact */}
        <Col span={12}>
          <Card title={<Space><TeamOutlined /><span>Katılımcılar</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item label="Katılımcıları Seçin">
              <EntityLookup
                value={attendees}
                onChange={(value) => setAttendees((value as EntityReference[]) || [])}
                entityTypes={['User', 'Account', 'Contact']}
                multiple={true}
                placeholder="Katılımcı ekleyin..."
                onSearch={entitySearchService.search}
                modalTitle="Katılımcı Seç"
                maxSelections={50}
              />
            </Form.Item>
          </Card>
        </Col>

        {/* İlgili Kayıt - Tek Seçimli, Lead/Account/Contact */}
        <Col span={24}>
          <Card title={<Space><LinkOutlined /><span>İlgili Kayıt</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item label="İlgili Kaydı Seçin">
              <EntityLookup
                value={regarding}
                onChange={(value) => setRegarding(value as EntityReference | null)}
                entityTypes={['Lead', 'Account', 'Contact']}
                multiple={false}
                placeholder="İlgili kayıt seçin..."
                onSearch={entitySearchService.search}
                modalTitle="İlgili Kayıt Seç"
              />
            </Form.Item>
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
                {isNewAppointment ? 'Yeni Randevu' : isViewMode ? 'Randevu Detayı' : 'Randevu Düzenle'}
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
                    <Button danger icon={<DeleteOutlined />}>Sil</Button>
                  </Popconfirm>
                  <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>Düzenle</Button>
                </>
              )}

              {(isEditMode || isCreateMode) && (
                <>
                  <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>İptal</Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    {isNewAppointment ? 'Oluştur' : 'Kaydet'}
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

export default AppointmentDetail;
