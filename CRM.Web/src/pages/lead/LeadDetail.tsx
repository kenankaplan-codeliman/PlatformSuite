import React, { useState, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Row,
  Col,
  Typography,
  Descriptions,
  Tag,
  Badge,
  Tabs,
} from 'antd';
import {
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

import { RoutePaths } from '@/config/route.paths';
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
import ActivityListView from '@/components/ActivityListView';

import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── Component ────────────────────────────────────────────────────────────────

const LeadDetail: React.FC<DetailPageProps<LeadDetailItem>> = (props) => {
  const store = useLeadStore();

  const [activeTab, setActiveTab] = useState<string>('details');
  const handleTabChange = useCallback((key: string) => setActiveTab(key), []);

  const detail = useDetailPage<LeadDetailItem>(
    {
      fetchById: (id) => store.fetchLeadById(id),
      createEntity: (values) => store.createLead(values),
      updateEntity: (values) => store.updateLead(values),
      deleteEntity: async (id) => {
        const { deleteLead } = useLeadStore.getState();
        await deleteLead(id);
      },
      currentEntity: store.currentLead,
      clearCurrentEntity: () => store.setCurrentLead(null),

      // Entity → Form dönüşümü (Lead'de tarih alanı yok, doğrudan map)
      mapEntityToForm: (entity) => ({ ...entity }),

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
      }),

      // Yeni kayıt default'ları
      defaultFormValues: {
        leadStatus: LeadStatus.New,
        leadRating: LeadRating.Cold,
        leadSource: LeadSource.Web,
      },

      listPath: RoutePaths.Lead.List,
      getViewPath: (entity) => RoutePaths.Lead.View(entity.id),
      // Lead'de complete/cancel yok
    },
    props
  );

  const currentLead = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentLead?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignLead(currentLead.id, user);
    await store.fetchLeadById(currentLead.id);
  }, [currentLead?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentLead?.id) return;
    if (isActive) {
      await store.deactivateLead(currentLead.id);
    } else {
      await store.activateLead(currentLead.id);
    }
    await store.fetchLeadById(currentLead.id);
  }, [currentLead?.id, store]);

  // ─── View Mode ──────────────────────────────────────────────────────────

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
                {/* İletişim Bilgileri */}
                <Col span={12}>
                  <Card title={<Space><UserOutlined /><span>İletişim Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={<><MailOutlined /> E-posta</>}>
                        {currentLead?.email ? (
                          <a href={`mailto:${currentLead.email}`}>{currentLead.email}</a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> Telefon</>}>
                        {currentLead?.phone ? (
                          <a href={`tel:${currentLead.phone}`}>{currentLead.phone}</a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> Mobil</>}>
                        {currentLead?.mobilePhone ? (
                          <a href={`tel:${currentLead.mobilePhone}`}>{currentLead.mobilePhone}</a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><GlobalOutlined /> Web Sitesi</>}>
                        {currentLead?.website ? (
                          <a href={currentLead.website} target="_blank" rel="noopener noreferrer">
                            {currentLead.website}
                          </a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><EnvironmentOutlined /> Adres</>}>
                        {currentLead?.address || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Şirket Bilgileri */}
                <Col span={12}>
                  <Card title={<Space><BankOutlined /><span>Şirket Bilgileri</span></Space>} style={{ marginBottom: 16 }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Sektör">
                        {currentLead?.industry || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Çalışan Sayısı">
                        {currentLead?.numberOfEmployees?.toLocaleString('tr-TR') || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Yıllık Gelir">
                        {currentLead?.annualRevenue
                          ? `₺${currentLead.annualRevenue.toLocaleString('tr-TR')}`
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kaynak">
                        {getLeadSourceLabel(currentLead?.leadSource ?? LeadSource.Web)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Açıklama */}
                {currentLead?.description && (
                  <Col span={24}>
                    <Card title={<Space><FileTextOutlined /><span>Açıklama</span></Space>} style={{ marginBottom: 16 }}>
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
                  regardingEntityId: detail.entityId,
                  regardingEntityType: EntityType.Lead,
                }}
              />
            ),
          },
        ]}
      />
    </>
  );

  // ─── Edit Mode ──────────────────────────────────────────────────────────

  const renderEditMode = () => (
    <Form form={detail.form} layout="vertical">
      <Row gutter={24}>
        {/* Temel Bilgiler */}
        <Col span={24}>
          <Card title={<Space><UserOutlined /><span>Temel Bilgiler</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="companyName" label="Şirket Adı" rules={[{ required: true, message: 'Şirket adı gereklidir' }]}>
                  <Input prefix={<BankOutlined />} placeholder="Şirket adı girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="firstName" label="Ad" rules={[{ required: true, message: 'Ad gereklidir' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Ad girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="lastName" label="Soyad" rules={[{ required: true, message: 'Soyad gereklidir' }]}>
                  <Input placeholder="Soyad girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="phone" label="Telefon">
                  <Input prefix={<PhoneOutlined />} placeholder="Telefon girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="email" label="E-posta" rules={[{ type: 'email', message: 'Geçerli bir e-posta girin' }]}>
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
            </Row>
          </Card>
        </Col>

        {/* Durum & Sınıflandırma */}
        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>Durum & Sınıflandırma</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="leadStatus" label="Durum" rules={[{ required: true, message: 'Durum seçimi gereklidir' }]}>
                  <Select options={leadStatusOptions} placeholder="Durum seçin" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="leadRating" label="Değerlendirme" rules={[{ required: true, message: 'Değerlendirme seçimi gereklidir' }]}>
                  <Select options={leadRatingOptions} placeholder="Değerlendirme seçin" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="leadSource" label="Kaynak" rules={[{ required: true, message: 'Kaynak seçimi gereklidir' }]}>
                  <Select options={leadSourceOptions} placeholder="Kaynak seçin" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Şirket Detayları */}
        <Col span={12}>
          <Card title={<Space><DollarOutlined /><span>Şirket Detayları</span></Space>} style={{ marginBottom: 16 }}>
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

        {/* Adres */}
        <Col span={24}>
          <Card title={<Space><EnvironmentOutlined /><span>Adres</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="address" label="Adres">
              <TextArea rows={2} placeholder="Adres girin" />
            </Form.Item>
          </Card>
        </Col>

        {/* Açıklama */}
        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>Açıklama</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="description" label="Açıklama">
              <TextArea rows={4} placeholder="Lead hakkında notlar..." />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  // ─── Layout ─────────────────────────────────────────────────────────────

  return (
    <DetailPageLayout
      title={{
        create: 'Yeni Lead',
        view: 'Lead Detayı',
        edit: 'Lead Düzenle',
      }}
      deleteConfirm={{
        title: 'Lead Silme',
        description: "Bu lead'i silmek istediğinizden emin misiniz?",
      }}
      notFoundTitle="Lead Bulunamadı"
      notFoundDescription="Aradığınız lead bulunamadı veya silinmiş olabilir."
      mode={detail.mode}
      isNew={detail.isNew}
      isViewMode={detail.isViewMode}
      isEditMode={detail.isEditMode}
      isCreateMode={detail.isCreateMode}
      isLoading={detail.isLoading}
      entityExists={!!currentLead}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentLead?.isActive}
      onStateChange={handleStateChange}
    />
  );
};

export default LeadDetail;