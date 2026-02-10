import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';
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
  Descriptions,
  Tag,
  Tooltip,
  Popconfirm,
  Tabs,
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
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { LeadDetailItem } from '@/types/lead.types';
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
import { StateType, useProcessState } from "@/stores/process.state.store";
import ActivityListView from '@/components/ActivityListView';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Page mode type
export type LeadDetailMode = 'view' | 'edit' | 'create';

// Props interface for component reuse
export interface LeadDetailProps {
  mode?: LeadDetailMode;
  leadId?: string;
  onModeChange?: (mode: LeadDetailMode) => void;
  onSave?: (lead: LeadDetailItem) => void;
  onCancel?: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = (props) => {

  // Router hooks
const params = useParams<{ id: string }>();
const navigate = useNavigate();
const [searchParams, setSearchParams] = useSearchParams();
const [form] = Form.useForm();

const { state } = useProcessState.getState();
  

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
    fetchLeadById,
    createLead,
    updateLead,
    setCurrentLead,
  } = useLeadStore();

  // Computed states
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNewLead;

  // Ref to prevent double fetch (like LeadList)
  const isFirstRender = useRef(true);

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

  // Fetch lead data on mount (only once)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      if (!isNewLead && leadId) {
        fetchLeadById(leadId);
      } else {
        setCurrentLead(null);
        setMode('create');
      }
    }
  }, [leadId, isNewLead, fetchLeadById, setCurrentLead]);

  useEffect(() => {
  const urlMode = searchParams.get('mode') as LeadDetailMode | null;
  if (urlMode && urlMode !== mode && !isNewLead) {
    setMode(urlMode);
  }
}, [searchParams, isNewLead]);


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
      navigate(RoutePaths.Lead.List);
    } else {
      form.setFieldsValue(currentLead);
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNewLead, navigate, form, currentLead, updateMode, props]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    
      const values = await form.validateFields();

      if (isNewLead) {
        const newLead = await createLead(values);
        
        props.onSave?.(newLead);
        navigate(RoutePaths.Lead.View(newLead.id));

      } else if (leadId) {
        const updatedLead = await updateLead(leadId, values);

        props.onSave?.(updatedLead);

        updateMode('view');
      }
  }, [form, isNewLead, leadId, createLead, updateLead, navigate, updateMode, props]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!leadId || isNewLead) return;

    const { deleteLead } = useLeadStore.getState();
      await deleteLead(leadId);
      navigate(RoutePaths.Lead.List);
      
  }, [leadId, isNewLead, navigate]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate(RoutePaths.Lead.List);
  }, [navigate]);



  const [activeTab, setActiveTab] = useState<string>('details');
  
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  // Not found state (only show if not loading and no error)
  if (!currentLead && !isNewLead ) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">Lead Bulunamadı</Title>
            <Text type="secondary">Aradığınız lead bulunamadı veya silinmiş olabilir.</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={handleBack}>Listeye Dön</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }



  // Don't render content while loading (modal handles loading state)
  if (state === StateType.Loading && !isNewLead) {
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
        defaultActiveKey={activeTab}
        onChange={handleTabChange}
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
              <ActivityListView
                initialFilters={{
                  regardingEntityId: leadId,
                  regardingEntityType: 'Lead',
                }}
                showFilters={true}
                showBulkActions={true}
                showPagination={true}
              />
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
                <Form.Item name="phone" label="Telefon">
                  <Input prefix={<PhoneOutlined />} placeholder="Telefon girin" />
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
                <Form.Item name="jobTitle" label="Ünvan">
                  <Input placeholder="Ünvan girin" />
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
