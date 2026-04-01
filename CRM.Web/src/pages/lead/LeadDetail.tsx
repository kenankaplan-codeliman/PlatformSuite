import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('lead');
  const { t: tc } = useTranslation('common');

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

      mapEntityToForm: (entity) => ({ ...entity }),
      mapFormToEntity: (values, id) => ({ ...values, id: id || undefined }),

      defaultFormValues: {
        leadStatus: LeadStatus.New,
        leadRating: LeadRating.Cold,
        leadSource: LeadSource.Web,
      },

      listPath: RoutePaths.Lead.List,
      getViewPath: (entity) => RoutePaths.Lead.View(entity.id),
    },
    props
  );

  const currentLead = detail.currentEntity;

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentLead?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignLead(currentLead.id, user);
    await store.fetchLeadById(currentLead.id);
  }, [currentLead?.id, store]);

  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentLead?.id) return;
    if (isActive) {
      await store.deactivateLead(currentLead.id);
    } else {
      await store.activateLead(currentLead.id);
    }
    await store.fetchLeadById(currentLead.id);
  }, [currentLead?.id, store]);

  // ─── View Mode ──────────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
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
                  text={currentLead?.isActive ? tc('status.active') : tc('status.inactive')}
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
                <Text type="secondary">{t('field.estimatedValueShort')}</Text>
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
            label: t('tab.details'),
            children: (
              <Row gutter={16}>
                {/* İletişim Bilgileri */}
                <Col span={12}>
                  <Card title={<Space><UserOutlined /><span>{t('section.contactInfo')}</span></Space>} style={{ marginBottom: 16 }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={<><MailOutlined /> {t('field.email')}</>}>
                        {currentLead?.email ? (
                          <a href={`mailto:${currentLead.email}`}>{currentLead.email}</a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> {t('field.phone')}</>}>
                        {currentLead?.phone ? (
                          <a href={`tel:${currentLead.phone}`}>{currentLead.phone}</a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> {t('field.mobilePhone')}</>}>
                        {currentLead?.mobilePhone ? (
                          <a href={`tel:${currentLead.mobilePhone}`}>{currentLead.mobilePhone}</a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><GlobalOutlined /> {t('field.website')}</>}>
                        {currentLead?.website ? (
                          <a href={currentLead.website} target="_blank" rel="noopener noreferrer">
                            {currentLead.website}
                          </a>
                        ) : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><EnvironmentOutlined /> {t('field.address')}</>}>
                        {currentLead?.address || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Şirket Bilgileri */}
                <Col span={12}>
                  <Card title={<Space><BankOutlined /><span>{t('section.companyInfo')}</span></Space>} style={{ marginBottom: 16 }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={t('field.industry')}>
                        {currentLead?.industry || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.numberOfEmployees')}>
                        {currentLead?.numberOfEmployees?.toLocaleString('tr-TR') || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.annualRevenue')}>
                        {currentLead?.annualRevenue
                          ? `₺${currentLead.annualRevenue.toLocaleString('tr-TR')}`
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.leadSource')}>
                        {getLeadSourceLabel(currentLead?.leadSource ?? LeadSource.Web)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {currentLead?.description && (
                  <Col span={24}>
                    <Card title={<Space><FileTextOutlined /><span>{t('section.description')}</span></Space>} style={{ marginBottom: 16 }}>
                      <Paragraph>{currentLead.description}</Paragraph>
                    </Card>
                  </Col>
                )}
              </Row>
            ),
          },
          {
            key: 'activities',
            label: t('tab.activities'),
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

  // ─── Edit Mode ──────────────────────────────────────────────────────────────

  const renderEditMode = () => (
    <Form form={detail.form} layout="vertical">
      <Row gutter={24}>
        {/* Temel Bilgiler */}
        <Col span={24}>
          <Card title={<Space><UserOutlined /><span>{t('section.basicInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="companyName" label={t('field.companyName')} rules={[{ required: true, message: t('validation.companyNameRequired') }]}>
                  <Input prefix={<BankOutlined />} placeholder={t('placeholder.companyName')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="firstName" label={t('field.firstName')}>
                  <Input prefix={<UserOutlined />} placeholder={t('placeholder.firstName')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="lastName" label={t('field.lastName')}>
                  <Input placeholder={t('placeholder.lastName')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="phone" label={t('field.phone')}>
                  <Input prefix={<PhoneOutlined />} placeholder={t('placeholder.phone')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="email" label={t('field.email')} rules={[{ type: 'email', message: t('validation.emailInvalid') }]}>
                  <Input prefix={<MailOutlined />} placeholder={t('placeholder.email')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="jobTitle" label={t('field.jobTitle')}>
                  <Input placeholder={t('placeholder.jobTitle')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="mobilePhone" label={t('field.mobilePhone')}>
                  <Input prefix={<PhoneOutlined />} placeholder={t('placeholder.mobilePhone')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="website" label={t('field.website')}>
                  <Input prefix={<GlobalOutlined />} placeholder={t('placeholder.website')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Durum & Sınıflandırma */}
        <Col span={12}>
          <Card title={<Space><ClockCircleOutlined /><span>{t('section.statusInfo')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="leadStatus" label={t('field.leadStatus')} rules={[{ required: true, message: t('validation.leadStatusRequired') }]}>
                  <Select options={leadStatusOptions} placeholder={t('placeholder.leadStatus')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="leadRating" label={t('field.leadRating')} rules={[{ required: true, message: t('validation.leadRatingRequired') }]}>
                  <Select options={leadRatingOptions} placeholder={t('placeholder.leadRating')} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="leadSource" label={t('field.leadSource')} rules={[{ required: true, message: t('validation.leadSourceRequired') }]}>
                  <Select options={leadSourceOptions} placeholder={t('placeholder.leadSource')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Şirket Detayları */}
        <Col span={12}>
          <Card title={<Space><DollarOutlined /><span>{t('section.companyDetails')}</span></Space>} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="industry" label={t('field.industry')}>
                  <Input placeholder={t('placeholder.industry')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="numberOfEmployees" label={t('field.numberOfEmployees')}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={t('field.numberOfEmployees')}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/\$\s?|(,*)/g, '') || '0', 10) as number}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="annualRevenue" label={t('field.annualRevenue')}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={t('field.annualRevenue')}
                    formatter={(value) => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/₺\s?|(,*)/g, '') || '0', 10) as number}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="estimatedValue" label={t('field.estimatedValue')}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={t('field.estimatedValue')}
                    formatter={(value) => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/₺\s?|(,*)/g, '') || '0', 10) as number}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Adres */}
        <Col span={24}>
          <Card title={<Space><EnvironmentOutlined /><span>{t('section.address')}</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="address" label={t('field.address')}>
              <TextArea rows={2} placeholder={t('placeholder.address')} />
            </Form.Item>
          </Card>
        </Col>

        {/* Açıklama */}
        <Col span={24}>
          <Card title={<Space><FileTextOutlined /><span>{t('section.description')}</span></Space>} style={{ marginBottom: 16 }}>
            <Form.Item name="description" label={t('field.description')}>
              <TextArea rows={4} placeholder={t('placeholder.description')} />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  // ─── Layout ─────────────────────────────────────────────────────────────────

  return (
    <DetailPageLayout
      title={{
        create: t('detail.titleCreate'),
        view: t('detail.titleView'),
        edit: t('detail.titleEdit'),
      }}
      deleteConfirm={{
        title: t('confirm.deleteTitle'),
        description: t('confirm.deleteDescription'),
      }}
      notFoundTitle={t('detail.notFoundTitle')}
      notFoundDescription={t('detail.notFoundDescription')}
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
      entityId={currentLead?.id}
      entityType={EntityType.Lead}
    />
  );
};

export default LeadDetail;
