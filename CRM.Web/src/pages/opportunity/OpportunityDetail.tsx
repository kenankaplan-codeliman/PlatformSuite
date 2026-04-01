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
  DatePicker,
} from 'antd';
import {
  RiseOutlined,
  BankOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

import { toLocalISO } from '@/util/dateHelper';

import { RoutePaths } from '@/config/route.paths';
import type { OpportunityDetailItem, OpportunityProductItem } from '@/types/opportunity.types';
import {
  OpportunityStage,
  getOpportunityStageLabel,
  getOpportunityStageColor,
  getOpportunitySourceLabel,
  opportunityStageOptions,
  opportunitySourceOptions,
  formatCurrency,
} from '@/types/opportunity.types';
import { useOpportunityStore } from '@/stores/opportunity.store';
import ActivityListView from '@/components/ActivityListView';
import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import EntityLookup from '@/components/EntityLookup';
import { entitySearchService } from '@/services/entity.search.service';
import { getEntityColor, getEntityIcon } from '@/config/entity.config';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// ─── Helper: Entity tag render (view mode) ───────────────────────────────────

const renderSelectedEntities = (entities: EntityReference[] | null | undefined) => {
  if (!entities || entities.length === 0) return <Text type="secondary">-</Text>;
  return (
    <Space wrap size={[4, 4]}>
      {entities.map((entity) => (
        <Tag key={entity.id} icon={getEntityIcon(entity.entityType)} color={getEntityColor(entity.entityType)}>
          {entity.name}
        </Tag>
      ))}
    </Space>
  );
};

// ─── Edit Form Component ──────────────────────────────────────────────────────
// renderEditMode içindeki Form.useWatch hook'larını izole eder.
// DetailPageLayout renderEditMode'u koşullu çağırdığından hook'ların
// ayrı component scope'unda olması zorunludur (Rules of Hooks).

interface OpportunityEditFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

const OpportunityEditForm: React.FC<OpportunityEditFormProps> = ({ form }) => {
  const { t } = useTranslation('opportunity');
  const currency      = Form.useWatch('currency', form) ?? 'TRY';
  const stage         = Form.useWatch('stage', form);
  const isClosedStage = stage === OpportunityStage.Won || stage === OpportunityStage.Lost;
  const currencySymbol  = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺';
  const currencyFormatter = (v: number | string | undefined) =>
    `${currencySymbol} ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const currencyParser = (v: string | undefined) =>
    parseFloat(v?.replace(new RegExp(`\\${currencySymbol}\\s?|(,*)`, 'g'), '') || '0') as number;

  return (
    <Form form={form} layout="vertical">
      <Row gutter={24}>

        {/* Temel Bilgiler */}
        <Col span={24}>
          <Card
            title={<Space><RiseOutlined /><span>{t('section.basicInfo')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={t('field.name')}
                  rules={[{ required: true, message: t('validation.nameRequired') }]}
                >
                  <Input prefix={<RiseOutlined />} placeholder={t('placeholder.name')} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="account"
                  label={t('field.account')}
                  rules={[{ required: true, message: t('validation.accountRequired') }]}
                >
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Account]}
                    multiple={false}
                    modalTitle={t('placeholder.selectAccount')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="contact" label={t('field.contact')}>
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Contact]}
                    multiple={false}
                    modalTitle={t('placeholder.selectContact')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="products"
                  label={t('field.products')}
                  rules={[{ required: true, type: 'array', min: 1, message: t('validation.productRequired') }]}
                >
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Product]}
                    multiple={true}
                    modalTitle={t('placeholder.selectProduct')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="stage"
                  label={t('field.stage')}
                  rules={[{ required: true, message: t('validation.stageRequired') }]}
                >
                  <Select options={opportunityStageOptions} placeholder={t('placeholder.stage')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="probability"
                  label={t('field.probability')}
                  rules={[{ required: true, message: t('validation.probabilityRequired') }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    formatter={(v) => `%${v}`}
                    parser={(v) => parseInt(v?.replace('%', '') || '0', 10) as number}
                    placeholder="0-100"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="source" label={t('field.source')}>
                  <Select
                    options={opportunitySourceOptions}
                    placeholder={t('placeholder.source')}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Finansal */}
        <Col span={24}>
          <Card
            title={<Space><BankOutlined /><span>{t('section.financial')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="currency" label={t('field.currency')}>
                  <Select
                    options={[
                      { label: 'TRY (₺)', value: 'TRY' },
                      { label: 'USD ($)', value: 'USD' },
                      { label: 'EUR (€)', value: 'EUR' },
                    ]}
                    placeholder={t('placeholder.currency')}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="estimatedValue"
                  label={t('field.estimatedValue')}
                  rules={[{ required: true, message: t('validation.estimatedValueRequired') }]}
                >
                  <InputNumber
                    key={`estimatedValue-${currency}`}
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="actualValue" label={t('field.actualValue')}>
                  <InputNumber
                    key={`actualValue-${currency}`}
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={isClosedStage ? '0' : t('placeholder.closedStageRequired')}
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled={!isClosedStage}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="closeDate" label={t('field.closeDate')}>
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    placeholder={isClosedStage ? t('placeholder.selectDate') : t('placeholder.closedStageDate')}
                    disabled={!isClosedStage}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Açıklama */}
        <Col span={24}>
          <Card
            title={<Space><FileTextOutlined /><span>{t('section.description')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="description" label={t('field.description')}>
              <TextArea rows={4} placeholder={t('placeholder.description')} />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const OpportunityDetail: React.FC<DetailPageProps<OpportunityDetailItem>> = (props) => {
  const store = useOpportunityStore();

  const [activeTab, setActiveTab] = useState<string>('details');
  const handleTabChange = useCallback((key: string) => setActiveTab(key), []);

  const detail = useDetailPage<OpportunityDetailItem>(
    {
      fetchById: (id) => store.fetchOpportunityById(id),
      createEntity: (values) => store.createOpportunity(values),
      updateEntity: (values) => store.updateOpportunity(values),
      deleteEntity: async (id) => {
        const { deleteOpportunity } = useOpportunityStore.getState();
        await deleteOpportunity(id);
      },
      currentEntity: store.currentOpportunity,
      clearCurrentEntity: () => store.setCurrentOpportunity(null),

      // Entity → Form dönüşümü
      mapEntityToForm: (entity) => ({
        ...entity,
        closeDate: entity.closeDate ? toLocalISO(entity.closeDate) : undefined,
        // Account → EntityReference
        account: entity.accountId
          ? ({ id: entity.accountId, name: entity.accountName, entityType: EntityType.Account } as EntityReference)
          : null,
        // Contact → EntityReference
        contact: entity.contactId
          ? ({ id: entity.contactId, name: entity.contactName, entityType: EntityType.Contact } as EntityReference)
          : null,
        // Products → EntityReference[] (form için)
        products: (entity.products ?? []).map((p) => ({
          id: p.productId,
          name: p.productName ?? '',
          entityType: EntityType.Product,
        } as EntityReference)),
      }),

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        closeDate: values.closeDate
          ? toLocalISO(values.closeDate)
          : undefined,
        // EntityReference → accountId / contactId
        accountId: values.account?.id,
        accountName: values.account?.name,
        contactId: values.contact?.id ?? undefined,
        contactName: values.contact?.name ?? undefined,
        // Products → OpportunityProductItem[]
        products: (values.products ?? []).map((p: EntityReference) => ({
          productId: p.id,
          productName: p.name,
        } as OpportunityProductItem)),
      }),

      defaultFormValues: {
        stage: OpportunityStage.Prospect,
        probability: 20,
        currency: 'TRY',
        products: [],
      },

      listPath: RoutePaths.Opportunity.List,
      getViewPath: (entity) => RoutePaths.Opportunity.View(entity.id),
    },
    props
  );

  const currentOpportunity = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentOpportunity?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignOpportunity(currentOpportunity.id, user);
    await store.fetchOpportunityById(currentOpportunity.id);
  }, [currentOpportunity?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentOpportunity?.id) return;
    if (isActive) {
      await store.deactivateOpportunity(currentOpportunity.id);
    } else {
      await store.activateOpportunity(currentOpportunity.id);
    }
    await store.fetchOpportunityById(currentOpportunity.id);
  }, [currentOpportunity?.id, store]);

  // ─── View Mode ──────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="auto">
            <Space align="center">
              <Title level={3} style={{ margin: 0 }}>
                {currentOpportunity?.name}
              </Title>
              <Tag
                style={{ backgroundColor:getOpportunityStageColor(currentOpportunity?.stage ?? OpportunityStage.Prospect), color: '#fff', border: 'none' }}
              >
                {getOpportunityStageLabel(
                  currentOpportunity?.stage ?? OpportunityStage.Prospect
                )}
              </Tag>
              <Badge
                status={currentOpportunity?.isActive ? 'success' : 'default'}
                text={currentOpportunity?.isActive ? 'Aktif' : 'Pasif'}
              />
            </Space>
            {currentOpportunity?.accountName && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary">
                  <BankOutlined style={{ marginRight: 4 }} />
                  {currentOpportunity.accountName}
                  {currentOpportunity.contactName &&
                    ` · ${currentOpportunity.contactName}`}
                </Text>
              </div>
            )}
          </Col>
          <Col>
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Tahmini Değer</Text>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {formatCurrency(
                  currentOpportunity?.estimatedValue ?? 0,
                  currentOpportunity?.currency
                )}
              </Title>
              {currentOpportunity?.actualValue != null && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Gerçekleşen:{' '}
                  {formatCurrency(
                    currentOpportunity.actualValue,
                    currentOpportunity.currency
                  )}
                </Text>
              )}
            </div>
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
                {/* Fırsat Bilgileri */}
                <Col span={12}>
                  <Card
                    title={<Space><RiseOutlined /><span>Fırsat Bilgileri</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Olasılık">
                        {currentOpportunity?.probability != null ? (
                          <Tag color="blue">%{currentOpportunity.probability}</Tag>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Firma">
                        {currentOpportunity?.accountName ? (
                          <Space size={4}>
                            <BankOutlined style={{ color: '#8c8c8c' }} />
                            <Text>{currentOpportunity.accountName}</Text>
                          </Space>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="İlgili Kişi">
                        {currentOpportunity?.contactName ? (
                          <Space size={4}>
                            <UserOutlined style={{ color: '#8c8c8c' }} />
                            <Text>{currentOpportunity.contactName}</Text>
                          </Space>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ürünler / Hizmetler">
                        {currentOpportunity?.products && currentOpportunity.products.length > 0 ? (
                          <>
                            {renderSelectedEntities(
                              currentOpportunity.products.map((p) => ({
                                id: p.productId,
                                name: p.productName ?? '',
                                entityType: EntityType.Product,
                              }))
                            )}

                          </>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kapanış Tarihi">
                        {currentOpportunity?.closeDate ? (
                          <Space size={4}>
                            <CalendarOutlined style={{ color: '#8c8c8c' }} />
                            {toLocalISO(currentOpportunity.closeDate)}
                          </Space>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kaynak">
                        {currentOpportunity?.source
                          ? getOpportunitySourceLabel(currentOpportunity.source)
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Para Birimi">
                        {currentOpportunity?.currency || '-'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Açıklama */}
                {currentOpportunity?.description && (
                  <Col span={24}>
                    <Card
                      title={<Space><FileTextOutlined /><span>Açıklama</span></Space>}
                      style={{ marginBottom: 16 }}
                    >
                      <Paragraph>{currentOpportunity.description}</Paragraph>
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
                  regardingEntityType: EntityType.Opportunity,
                }}
              />
            ),
          },
        ]}
      />
    </>
  );

  // ─── Edit Mode ──────────────────────────────────────────────────────────

  const renderEditMode = () => <OpportunityEditForm form={detail.form} />;

  // ─── Layout ─────────────────────────────────────────────────────────────

  return (
    <DetailPageLayout
      title={{
        create: 'Yeni Fırsat',
        view: 'Fırsat Detayı',
        edit: 'Fırsat Düzenle',
      }}
      deleteConfirm={{
        title: 'Fırsat Silme',
        description: 'Bu fırsatı silmek istediğinizden emin misiniz?',
      }}
      notFoundTitle="Fırsat Bulunamadı"
      notFoundDescription="Aradığınız fırsat bulunamadı veya silinmiş olabilir."
      mode={detail.mode}
      isNew={detail.isNew}
      isViewMode={detail.isViewMode}
      isEditMode={detail.isEditMode}
      isCreateMode={detail.isCreateMode}
      isLoading={detail.isLoading}
      entityExists={!!currentOpportunity}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentOpportunity?.isActive}
      onStateChange={handleStateChange}
      entityId={currentOpportunity?.id}
      entityType={EntityType.Opportunity}
    />
  );
};

export default OpportunityDetail;