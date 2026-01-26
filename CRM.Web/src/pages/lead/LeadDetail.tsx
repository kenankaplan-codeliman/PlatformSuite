import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  message,
  Spin,
  Alert,
  Descriptions,
  Tag,
  Tooltip,
  Popconfirm,
  Tabs,
  Timeline,
  Badge,
  Switch,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  BankOutlined,
  DollarOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { Lead } from '@/types/lead.types';
import {
  LeadStatus,
  LeadRating,
  LeadSource,
  getLeadStatusLabel,
  getLeadSourceLabel,
  getLeadRatingLabel,
  getLeadStatusColor,
  getLeadRatingColor,
  leadSourceOptions,
  leadStatusOptions,
  leadRatingOptions,
} from '@/types/lead.types';
import { useLeadStore } from '@/stores/lead.store';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Page mode type
export type LeadDetailMode = 'view' | 'edit' | 'create';

// Props interface for component reuse
export interface LeadDetailProps {
  mode?: LeadDetailMode;
  leadId?: string;
  onModeChange?: (mode: LeadDetailMode) => void;
  onSave?: (lead: Lead) => void;
  onCancel?: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = (props) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  // Determine mode from props, URL params, or default
  const urlMode = searchParams.get('mode') as LeadDetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<LeadDetailMode>(initialMode);

  // Determine lead ID
  const leadId = props.leadId || params.id;
  const isNewLead = leadId === 'new' || !leadId;

  // Store state and actions
  const {
    currentLead,
    detailLoading,
    detailError,
    fetchLeadById,
    createLead,
    updateLead,
    setCurrentLead,
  } = useLeadStore();

  // Computed states
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewLead;

  // Sync mode with URL
  const updateMode = useCallback(
    (newMode: LeadDetailMode) => {
      setMode(newMode);
      if (!props.mode) {
        setSearchParams({ mode: newMode }, { replace: true });
      }
      props.onModeChange?.(newMode);
    },
    [props, setSearchParams]
  );

  // Fetch lead data on mount
  useEffect(() => {
    if (!isNewLead && leadId) {
      fetchLeadById(leadId);
    } else {
      setCurrentLead(null);
      setMode('create');
    }
  }, [leadId, isNewLead, fetchLeadById, setCurrentLead]);

  // Populate form when lead data changes
  useEffect(() => {
    if (currentLead && !isNewLead) {
      form.setFieldsValue(currentLead);
    } else if (isNewLead) {
      form.resetFields();
      // Set default values for new lead
      form.setFieldsValue({
        leadStatus: LeadStatus.New,
        leadRating: LeadRating.Cold,
        leadSource: LeadSource.Web,
        isActive: true,
      });
    }
  }, [currentLead, form, isNewLead]);

  // Handle mode toggle
  const handleEdit = useCallback(() => {
    updateMode('edit');
  }, [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNewLead) {
      navigate('/leads');
    } else {
      form.setFieldsValue(currentLead);
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewLead, navigate, form, currentLead, updateMode, props]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();

      if (isNewLead) {
        const newLead = await createLead(values);
        message.success('Lead başarıyla oluşturuldu');
        props.onSave?.(newLead);
        navigate(`/leads/${newLead.id}?mode=view`);
      } else if (leadId) {
        const updatedLead = await updateLead(leadId, values);
        message.success('Lead başarıyla güncellendi');
        props.onSave?.(updatedLead);
        updateMode('view');
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Kaydetme işlemi sırasında hata oluştu');
      }
    }
  }, [form, isNewLead, leadId, createLead, updateLead, navigate, updateMode, props]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!leadId || isNewLead) return;

    try {
      const { deleteLead } = useLeadStore.getState();
      await deleteLead(leadId);
      message.success('Lead başarıyla silindi');
      navigate('/leads');
    } catch {
      message.error('Silme işlemi sırasında hata oluştu');
    }
  }, [leadId, isNewLead, navigate]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate('/leads');
  }, [navigate]);

  // Loading state
  if (detailLoading && !isNewLead) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" tip="Lead bilgileri yükleniyor..." />
      </div>
    );
  }

  // Error state
  if (detailError && !isNewLead) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="error"
          message="Hata"
          description={detailError}
          showIcon
          action={
            <Button size="small" onClick={() => leadId && fetchLeadById(leadId)}>
              Tekrar Dene
            </Button>
          }
        />
      </div>
    );
  }

  // Not found state
  if (!currentLead && !isNewLead && !detailLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          type="warning"
          message="Lead Bulunamadı"
          description="Aradığınız lead bulunamadı veya silinmiş olabilir."
          showIcon
          action={
            <Button onClick={handleBack}>Listeye Dön</Button>
          }
        />
      </div>
    );
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
                <Title level={3} style={{ margin: 0 }}>
                  {currentLead?.companyName}
                </Title>
                <Tag color={getLeadStatusColor(currentLead?.leadStatus ?? LeadStatus.New)}>
                  {getLeadStatusLabel(currentLead?.leadStatus ?? LeadStatus.New)}
                </Tag>
                <Tag color={getLeadRatingColor(currentLead?.leadRating ?? LeadRating.Cold)}>
                  {getLeadRatingLabel(currentLead?.leadRating ?? LeadRating.Cold)}
                </Tag>
                <Badge
                  status={currentLead?.isActive ? 'success' : 'default'}
                  text={currentLead?.isActive ? 'Aktif' : 'Pasif'}
                />
              </Space>
              <Text type="secondary">
                <UserOutlined style={{ marginRight: 4 }} />
                {currentLead?.firstName} {currentLead?.lastName}
                {currentLead?.jobTitle && ` · ${currentLead.jobTitle}`}
              </Text>
            </Space>
          </Col>
          <Col>
            {currentLead?.estimatedValue && (
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary">Tahmini Değer</Text>
                <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                  ₺{currentLead.estimatedValue.toLocaleString('tr-TR')}
                </Title>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Tabs
        defaultActiveKey="details"
        items={[
          {
            key: 'details',
            label: 'Detaylar',
            children: (
              <Row gutter={16}>
                {/* Contact Information */}
                <Col span={12}>
                  <Card
                    title={
                      <Space>
                        <UserOutlined />
                        <span>İletişim Bilgileri</span>
                      </Space>
                    }
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={<><MailOutlined /> E-posta</>}>
                        {currentLead?.email ? (
                          <a href={`mailto:${currentLead.email}`}>{currentLead.email}</a>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> Telefon</>}>
                        {currentLead?.phone ? (
                          <a href={`tel:${currentLead.phone}`}>{currentLead.phone}</a>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> Mobil</>}>
                        {currentLead?.mobilePhone ? (
                          <a href={`tel:${currentLead.mobilePhone}`}>{currentLead.mobilePhone}</a>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><GlobalOutlined /> Web Sitesi</>}>
                        {currentLead?.website ? (
                          <a href={currentLead.website} target="_blank" rel="noopener noreferrer">
                            {currentLead.website}
                          </a>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><EnvironmentOutlined /> Adres</>}>
                        {currentLead?.address || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Company Information */}
                <Col span={12}>
                  <Card
                    title={
                      <Space>
                        <BankOutlined />
                        <span>Şirket Bilgileri</span>
                      </Space>
                    }
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Sektör">
                        {currentLead?.industry || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Çalışan Sayısı">
                        {currentLead?.numberOfEmployees?.toLocaleString('tr-TR') || (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Yıllık Gelir">
                        {currentLead?.annualRevenue ? (
                          `₺${currentLead.annualRevenue.toLocaleString('tr-TR')}`
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kaynak">
                        {getLeadSourceLabel(currentLead?.leadSource ?? LeadSource.Web)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Description */}
                {currentLead?.description && (
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
                      <Paragraph>{currentLead.description}</Paragraph>
                    </Card>
                  </Col>
                )}
              </Row>
            ),
          },
          {
            key: 'activities',
            label: 'Aktiviteler',
            children: (
              <Card>
                <Timeline
                  items={[
                    {
                      color: 'green',
                      dot: <CheckCircleOutlined />,
                      children: (
                        <>
                          <Text strong>Lead Oluşturuldu</Text>
                          <br />
                          <Text type="secondary">
                            {currentLead?.createdAt
                              ? new Date(currentLead.createdAt).toLocaleString('tr-TR')
                              : '-'}
                          </Text>
                        </>
                      ),
                    },
                    ...(currentLead?.updatedAt
                      ? [
                          {
                            color: 'blue',
                            dot: <SyncOutlined />,
                            children: (
                              <>
                                <Text strong>Son Güncelleme</Text>
                                <br />
                                <Text type="secondary">
                                  {new Date(currentLead.updatedAt).toLocaleString('tr-TR')}
                                </Text>
                              </>
                            ),
                          },
                        ]
                      : []),
                    ...(currentLead?.convertedDate
                      ? [
                          {
                            color: 'purple',
                            dot: <CheckCircleOutlined />,
                            children: (
                              <>
                                <Text strong>Dönüştürüldü</Text>
                                <br />
                                <Text type="secondary">
                                  {new Date(currentLead.convertedDate).toLocaleString('tr-TR')}
                                </Text>
                              </>
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              </Card>
            ),
          },
        ]}
      />
    </>
  );

  // Render Edit/Create Mode
  const renderEditMode = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        isNewLead
          ? {
              leadStatus: LeadStatus.New,
              leadRating: LeadRating.Cold,
              leadSource: LeadSource.Web,
              isActive: true,
            }
          : currentLead || undefined
      }
    >
      <Row gutter={24}>
        {/* Basic Information */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Temel Bilgiler</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="companyName"
                  label="Şirket Adı"
                  rules={[{ required: true, message: 'Şirket adı gereklidir' }]}
                >
                  <Input prefix={<BankOutlined />} placeholder="Şirket adı girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="firstName"
                  label="Ad"
                  rules={[{ required: true, message: 'Ad gereklidir' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Ad girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="lastName"
                  label="Soyad"
                  rules={[{ required: true, message: 'Soyad gereklidir' }]}
                >
                  <Input placeholder="Soyad girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="jobTitle" label="Ünvan">
                  <Input placeholder="Ünvan girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="E-posta"
                  rules={[{ type: 'email', message: 'Geçerli bir e-posta girin' }]}
                >
                  <Input prefix={<MailOutlined />} placeholder="E-posta girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="phone" label="Telefon">
                  <Input prefix={<PhoneOutlined />} placeholder="Telefon girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="mobilePhone" label="Mobil Telefon">
                  <Input prefix={<PhoneOutlined />} placeholder="Mobil telefon girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="website" label="Web Sitesi">
                  <Input prefix={<GlobalOutlined />} placeholder="https://example.com" />
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

        {/* Lead Status & Classification */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Durum & Sınıflandırma</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="leadStatus"
                  label="Durum"
                  rules={[{ required: true, message: 'Durum seçimi gereklidir' }]}
                >
                  <Select options={leadStatusOptions} placeholder="Durum seçin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="leadRating"
                  label="Değerlendirme"
                  rules={[{ required: true, message: 'Değerlendirme seçimi gereklidir' }]}
                >
                  <Select options={leadRatingOptions} placeholder="Değerlendirme seçin" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="leadSource"
                  label="Kaynak"
                  rules={[{ required: true, message: 'Kaynak seçimi gereklidir' }]}
                >
                  <Select options={leadSourceOptions} placeholder="Kaynak seçin" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Company Details */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <DollarOutlined />
                <span>Şirket Detayları</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="industry" label="Sektör">
                  <Input placeholder="Sektör girin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="numberOfEmployees" label="Çalışan Sayısı">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="Çalışan sayısı"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/\$\s?|(,*)/g, '') || '0', 10) as any}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="annualRevenue" label="Yıllık Gelir (₺)">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="Yıllık gelir"
                    formatter={(value) => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/₺\s?|(,*)/g, '') || '0', 10) as any}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="estimatedValue" label="Tahmini Değer (₺)">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="Tahmini değer"
                    formatter={(value) => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/₺\s?|(,*)/g, '') || '0', 10) as any}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Address */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                <span>Adres</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="address" label="Adres">
              <TextArea rows={2} placeholder="Adres girin" />
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
              <TextArea rows={4} placeholder="Lead hakkında notlar..." />
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
                {isNewLead ? 'Yeni Lead' : isViewMode ? 'Lead Detayı' : 'Lead Düzenle'}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNewLead && (
                <>
                  <Popconfirm
                    title="Lead Silme"
                    description="Bu lead'i silmek istediğinizden emin misiniz?"
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
                    {isNewLead ? 'Oluştur' : 'Kaydet'}
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

export default LeadDetail;
