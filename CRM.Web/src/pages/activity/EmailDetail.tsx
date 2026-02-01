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
  MailOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  FileTextOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { EmailActivity } from '@/types/activity.types';
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
export type EmailDetailMode = 'view' | 'edit' | 'create';

// Props interface for component reuse
export interface EmailDetailProps {
  mode?: EmailDetailMode;
  emailId?: string;
  onModeChange?: (mode: EmailDetailMode) => void;
  onSave?: (email: EmailActivity) => void;
  onCancel?: () => void;
}

const EmailDetail: React.FC<EmailDetailProps> = (props) => {
  // Router hooks
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  const { state } = useProcessState.getState();

  // Determine mode from props, URL params, or default
  const urlMode = searchParams.get('mode') as EmailDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<EmailDetailMode>(initialMode);

  // Determine email ID
  const emailId = props.emailId || params.id;
  const isNewEmail = emailId === 'new' || !emailId;

  // Store state and actions
  const {
    currentActivity,
    fetchActivityById,
    createActivity,
    updateActivity,
    setCurrentActivity,
  } = useActivityStore();

  // Cast currentActivity to EmailActivity
  const currentEmail = currentActivity as EmailActivity | null;

  // Computed states
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewEmail;

  // Ref to prevent double fetch
  const isFirstRender = useRef(true);

  // Sync mode with URL
  const updateMode = useCallback(
    (newMode: EmailDetailMode) => {
      setMode(newMode);
      if (!props.mode) {
        setSearchParams({ mode: newMode }, { replace: true });
      }
      props.onModeChange?.(newMode);
    },
    [props, setSearchParams]
  );

  // Fetch email data on mount (only once)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      if (!isNewEmail && emailId) {
        fetchActivityById(emailId);
      } else {
        setCurrentActivity(null);
        setMode('create');
      }
    }
  }, [emailId, isNewEmail, fetchActivityById, setCurrentActivity]);

  // Sync mode with URL changes
  useEffect(() => {
    const urlMode = searchParams.get('mode') as EmailDetailMode | null;
    if (urlMode && urlMode !== mode && !isNewEmail) {
      setMode(urlMode);
    }
  }, [searchParams, isNewEmail, mode]);

  // Populate form when email data changes
  useEffect(() => {
    if (currentEmail && !isNewEmail) {
      form.setFieldsValue({
        ...currentEmail,
        dueDate: currentEmail.dueDate ? dayjs(currentEmail.dueDate) : null,
        sentDateTime: currentEmail.sentDateTime ? dayjs(currentEmail.sentDateTime) : null,
      });
    } else if (isNewEmail) {
      form.resetFields();
      // Set default values for new email
      form.setFieldsValue({
        activityType: ActivityType.Email,
        status: ActivityStatus.NotStarted,
        priority: ActivityPriority.Normal,
        isActive: true,
        direction: 'Outgoing',
      });
    }
  }, [currentEmail, form, isNewEmail]);

  // Handle mode toggle
  const handleEdit = useCallback(() => {
    updateMode('edit');
  }, [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNewEmail) {
      navigate(RoutePaths.Activity.List);
    } else {
      form.setFieldsValue({
        ...currentEmail,
        dueDate: currentEmail?.dueDate ? dayjs(currentEmail.dueDate) : null,
        sentDateTime: currentEmail?.sentDateTime ? dayjs(currentEmail.sentDateTime) : null,
      });
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewEmail, navigate, form, currentEmail, updateMode, props]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    const values = await form.validateFields();

    // Format dates
    const formattedValues = {
      ...values,
      activityType: ActivityType.Email,
      dueDate: values.dueDate?.toISOString(),
      sentDateTime: values.sentDateTime?.toISOString(),
    };

    if (isNewEmail) {
      const newEmail = await createActivity<EmailActivity>(formattedValues);
      props.onSave?.(newEmail);
      navigate(RoutePaths.Activity.Email.View(newEmail.id));
    } else if (emailId) {
      const updatedEmail = await updateActivity<EmailActivity>(emailId, formattedValues);
      props.onSave?.(updatedEmail);
      updateMode('view');
    }
  }, [form, isNewEmail, emailId, createActivity, updateActivity, navigate, updateMode, props]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!emailId || isNewEmail) return;

    const { deleteActivity } = useActivityStore.getState();
    await deleteActivity(emailId);
    navigate(RoutePaths.Activity.List);
  }, [emailId, isNewEmail, navigate]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(RoutePaths.Activity.List);
  }, [navigate]);

  // Not found state
  if (!currentEmail && !isNewEmail) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">
              E-posta Bulunamadı
            </Title>
            <Text type="secondary">Aradığınız e-posta bulunamadı veya silinmiş olabilir.</Text>
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
  if (state === StateType.Loading && !isNewEmail) {
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
                <MailOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Title level={3} style={{ margin: 0 }}>
                  {currentEmail?.subject}
                </Title>
                <Tag color={getActivityStatusColor(currentEmail?.status ?? ActivityStatus.NotStarted)}>
                  {getActivityStatusLabel(currentEmail?.status ?? ActivityStatus.NotStarted)}
                </Tag>
                <Tag
                  color={getActivityPriorityColor(currentEmail?.priority ?? ActivityPriority.Normal)}
                  icon={<FlagOutlined />}
                >
                  {getActivityPriorityLabel(currentEmail?.priority ?? ActivityPriority.Normal)}
                </Tag>
                <Badge
                  status={currentEmail?.isActive ? 'success' : 'default'}
                  text={currentEmail?.isActive ? 'Aktif' : 'Pasif'}
                />
              </Space>
              {currentEmail?.regardingEntityType && (
                <Text type="secondary">
                  İlgili: {currentEmail.regardingEntityType} - {currentEmail.regardingEntityId}
                </Text>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Email Details */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <SendOutlined />
                <span>E-posta Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Kimden">{currentEmail?.from || '-'}</Descriptions.Item>
              <Descriptions.Item label="Kime">{currentEmail?.to || '-'}</Descriptions.Item>
              <Descriptions.Item label="CC">{currentEmail?.cc || '-'}</Descriptions.Item>
              <Descriptions.Item label="BCC">{currentEmail?.bcc || '-'}</Descriptions.Item>
              <Descriptions.Item label="Yön">
                <Tag color={currentEmail?.direction === 'Incoming' ? 'blue' : 'green'}>
                  {currentEmail?.direction === 'Incoming' ? 'Gelen' : 'Giden'}
                </Tag>
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
              <Descriptions.Item label="Gönderilme Tarihi">
                {currentEmail?.sentDateTime
                  ? dayjs(currentEmail.sentDateTime).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Oluşturma Tarihi">
                {currentEmail?.createdAt
                  ? dayjs(currentEmail.createdAt).format('DD.MM.YYYY HH:mm')
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Oluşturan">{currentEmail?.createdBy || '-'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Email Body */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>E-posta İçeriği</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <div
              style={{
                padding: 16,
                background: '#fafafa',
                borderRadius: 4,
                minHeight: 200,
              }}
              dangerouslySetInnerHTML={{
                __html: currentEmail?.body || '<p>İçerik bulunmuyor.</p>',
              }}
            />
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
            <Paragraph>{currentEmail?.description || 'Açıklama girilmemiş.'}</Paragraph>
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
                <MailOutlined />
                <span>E-posta Bilgileri</span>
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
                  <Input placeholder="E-posta konusu girin" />
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

        {/* Recipients */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <SendOutlined />
                <span>Alıcı Bilgileri</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="from"
                  label="Kimden"
                  rules={[{ type: 'email', message: 'Geçerli bir e-posta girin' }]}
                >
                  <Input placeholder="gonderen@example.com" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="to"
                  label="Kime"
                  rules={[
                    { required: true, message: 'Alıcı gereklidir' },
                    { type: 'email', message: 'Geçerli bir e-posta girin' },
                  ]}
                >
                  <Input placeholder="alici@example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cc" label="CC">
                  <Input placeholder="cc@example.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="bcc" label="BCC">
                  <Input placeholder="bcc@example.com" />
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
                <Form.Item name="sentDateTime" label="Gönderilme Tarihi">
                  <DatePicker
                    showTime
                    format="DD.MM.YYYY HH:mm"
                    style={{ width: '100%' }}
                    placeholder="Gönderilme tarihi"
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

        {/* Email Body */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>E-posta İçeriği</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="body" label="İçerik">
              <TextArea rows={8} placeholder="E-posta içeriği..." />
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
              <TextArea rows={4} placeholder="E-posta hakkında notlar..." />
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
                {isNewEmail ? 'Yeni E-posta' : isViewMode ? 'E-posta Detayı' : 'E-posta Düzenle'}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNewEmail && (
                <>
                  <Popconfirm
                    title="E-posta Silme"
                    description="Bu e-postayı silmek istediğinizden emin misiniz?"
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
                    {isNewEmail ? 'Oluştur' : 'Kaydet'}
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

export default EmailDetail;
