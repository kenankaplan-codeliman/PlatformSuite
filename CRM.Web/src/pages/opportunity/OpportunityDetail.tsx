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
  Table,
  Button,
  Switch,
  DatePicker,
} from 'antd';
import {
  RiseOutlined,
  BankOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { RoutePaths } from '@/config/route.paths';
import type {
  OpportunityDetailItem,
  OpportunityProductItem,
} from '@/types/opportunity.types';
import {
  OpportunityStage,
  getOpportunityStageLabel,
  getOpportunityStageColor,
  getOpportunitySourceLabel,
  opportunityStageOptions,
  opportunitySourceOptions,
  formatCurrency,
  calculateTotalPrice,
} from '@/types/opportunity.types';
import { useOpportunityStore } from '@/stores/opportunity.store';
import ActivityListView from '@/components/ActivityListView';
import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import EntityLookup from '@/components/EntityLookup';
import { entitySearchService } from '@/services/entity.search.service';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

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
        closeDate: entity.closeDate ? dayjs(entity.closeDate) : undefined,
        // Account → EntityReference
        account: entity.accountId
          ? ({ id: entity.accountId, name: entity.accountName, entityType: EntityType.Account } as EntityReference)
          : null,
        // Contact → EntityReference
        contact: entity.contactId
          ? ({ id: entity.contactId, name: entity.contactName, entityType: EntityType.Contact } as EntityReference)
          : null,
        // Products → form satırı: product lookup için EntityReference'a çevir
        products: (entity.products ?? []).map((p) => ({
          id: p.id,
          product: p.productId
            ? ({ id: p.productId, name: p.productName, entityType: EntityType.Product } as EntityReference)
            : null,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          discountPercent: p.discountPercent,
          discountAmount: p.discountAmount,
          description: p.description,
        })),
      }),

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        closeDate: values.closeDate
          ? dayjs(values.closeDate).format('YYYY-MM-DD')
          : undefined,
        // EntityReference → accountId / contactId
        accountId: values.account?.id,
        accountName: values.account?.name,
        contactId: values.contact?.id ?? undefined,
        contactName: values.contact?.name ?? undefined,
        // Products → OpportunityProductItem
        products: (values.products ?? [])
          .filter((p: any) => p.product != null)
          .map((p: any) => ({
            id: p.id,
            productId: p.product.id,
            productName: p.product.name,
            quantity: p.quantity ?? 1,
            unitPrice: p.unitPrice ?? 0,
            discountPercent: p.discountPercent ?? 0,
            discountAmount: p.discountAmount ?? 0,
            description: p.description ?? undefined,
          })),
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
                color={getOpportunityStageColor(
                  currentOpportunity?.stage ?? OpportunityStage.Prospect
                )}
                style={{ color: '#fff', border: 'none' }}
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
                      <Descriptions.Item label="Aşama">
                        <Tag
                          color={getOpportunityStageColor(
                            currentOpportunity?.stage ?? OpportunityStage.Prospect
                          )}
                          style={{ color: '#fff', border: 'none' }}
                        >
                          {getOpportunityStageLabel(
                            currentOpportunity?.stage ?? OpportunityStage.Prospect
                          )}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Olasılık">
                        {currentOpportunity?.probability != null ? (
                          <Tag color="blue">%{currentOpportunity.probability}</Tag>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kapanış Tarihi">
                        {currentOpportunity?.closeDate ? (
                          <Space size={4}>
                            <CalendarOutlined style={{ color: '#8c8c8c' }} />
                            {dayjs(currentOpportunity.closeDate).format('DD.MM.YYYY')}
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

                {/* İlişkiler */}
                <Col span={12}>
                  <Card
                    title={<Space><BankOutlined /><span>İlişkiler</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
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
                    </Descriptions>
                  </Card>

                  {/* Kayıt Bilgileri */}
                  <Card
                    title={<Space><ClockCircleOutlined /><span>Kayıt Bilgileri</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Oluşturulma">
                        {currentOpportunity?.createdAt
                          ? dayjs(currentOpportunity.createdAt).format('DD.MM.YYYY HH:mm')
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Son Güncelleme">
                        {currentOpportunity?.updatedAt
                          ? dayjs(currentOpportunity.updatedAt).format('DD.MM.YYYY HH:mm')
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Ürünler */}
                {currentOpportunity?.products && currentOpportunity.products.length > 0 && (
                  <Col span={24}>
                    <Card
                      title={<Space><ShoppingOutlined /><span>Ürünler / Hizmetler</span></Space>}
                      style={{ marginBottom: 16 }}
                    >
                      <Table<OpportunityProductItem>
                        dataSource={currentOpportunity.products}
                        rowKey={(r) => r.id ?? r.productId}
                        pagination={false}
                        size="small"
                        summary={(rows) => {
                          const total = rows.reduce(
                            (sum, r) => sum + (r.totalPrice ?? calculateTotalPrice(r)),
                            0
                          );
                          return (
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0} colSpan={4}>
                                <Text strong>Toplam</Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={4}>
                                <Text strong style={{ color: '#52c41a' }}>
                                  {formatCurrency(total, currentOpportunity.currency)}
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={5} />
                            </Table.Summary.Row>
                          );
                        }}
                        columns={[
                          {
                            title: 'Ürün',
                            dataIndex: 'productName',
                            key: 'productName',
                            render: (name: string) => (
                              <Space size={4}>
                                <ShoppingOutlined style={{ color: '#8c8c8c' }} />
                                <Text>{name}</Text>
                              </Space>
                            ),
                          },
                          {
                            title: 'Adet',
                            dataIndex: 'quantity',
                            key: 'quantity',
                            width: 70,
                            align: 'right',
                          },
                          {
                            title: 'Birim Fiyat',
                            dataIndex: 'unitPrice',
                            key: 'unitPrice',
                            width: 130,
                            align: 'right',
                            render: (v: number) =>
                              formatCurrency(v, currentOpportunity.currency),
                          },
                          {
                            title: 'İndirim',
                            key: 'discount',
                            width: 130,
                            align: 'right',
                            render: (_: unknown, record: OpportunityProductItem) => {
                              if (record.discountPercent > 0)
                                return <Text type="secondary">%{record.discountPercent}</Text>;
                              if (record.discountAmount > 0)
                                return (
                                  <Text type="secondary">
                                    -{formatCurrency(record.discountAmount, currentOpportunity.currency)}
                                  </Text>
                                );
                              return <Text type="secondary">-</Text>;
                            },
                          },
                          {
                            title: 'Tutar',
                            key: 'totalPrice',
                            width: 130,
                            align: 'right',
                            render: (_: unknown, record: OpportunityProductItem) => (
                              <Text strong style={{ color: '#52c41a' }}>
                                {formatCurrency(
                                  record.totalPrice ?? calculateTotalPrice(record),
                                  currentOpportunity.currency
                                )}
                              </Text>
                            ),
                          },
                          {
                            title: 'Not',
                            dataIndex: 'description',
                            key: 'description',
                            render: (v: string) =>
                              v ? <Text type="secondary">{v}</Text> : <Text type="secondary">-</Text>,
                          },
                        ]}
                      />
                    </Card>
                  </Col>
                )}

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
                showFilters
                showBulkActions
                showPagination
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
          <Card
            title={<Space><RiseOutlined /><span>Temel Bilgiler</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Fırsat Adı"
                  rules={[{ required: true, message: 'Fırsat adı gereklidir' }]}
                >
                  <Input prefix={<RiseOutlined />} placeholder="Fırsat adı girin" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="stage"
                  label="Aşama"
                  rules={[{ required: true, message: 'Aşama seçimi gereklidir' }]}
                >
                  <Select options={opportunityStageOptions} placeholder="Aşama seçin" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="probability"
                  label="Olasılık (%)"
                  rules={[{ required: true, message: 'Olasılık gereklidir' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    formatter={(v) => `%${v}`}
                    parser={(v) => parseInt(v?.replace('%', '') || '0', 10) as any}
                    placeholder="0-100"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="estimatedValue"
                  label="Tahmini Değer"
                  rules={[{ required: true, message: 'Tahmini değer gereklidir' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    formatter={(v) => `₺ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(v) => parseFloat(v?.replace(/₺\s?|(,*)/g, '') || '0') as any}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="actualValue" label="Gerçekleşen Değer">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder="0"
                    formatter={(v) => `₺ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(v) => parseFloat(v?.replace(/₺\s?|(,*)/g, '') || '0') as any}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="currency" label="Para Birimi">
                  <Select
                    options={[
                      { label: 'TRY (₺)', value: 'TRY' },
                      { label: 'USD ($)', value: 'USD' },
                      { label: 'EUR (€)', value: 'EUR' },
                    ]}
                    placeholder="Para birimi"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="closeDate" label="Kapanış Tarihi">
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    placeholder="Tarih seçin"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="source" label="Kaynak">
                  <Select
                    options={opportunitySourceOptions}
                    placeholder="Kaynak seçin"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="isActive"
                  label="Durum"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* İlişkiler */}
        <Col span={24}>
          <Card
            title={<Space><BankOutlined /><span>İlişkiler</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="account"
                  label="Firma"
                  rules={[{ required: true, message: 'Firma seçimi gereklidir' }]}
                >
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Account]}
                    multiple={false}
                    modalTitle="Firma seçin..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contact" label="İlgili Kişi">
                  <EntityLookup
                    onSearch={entitySearchService.search}
                    entityTypes={[EntityType.Contact]}
                    multiple={false}
                    modalTitle="Kişi seçin..."
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Ürünler */}
        <Col span={24}>
          <Card
            title={<Space><ShoppingOutlined /><span>Ürünler / Hizmetler</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.List name="products">
              {(fields, { add, remove }) => (
                <>
                  {/* Başlık satırı */}
                  <Row
                    gutter={8}
                    align="middle"
                    style={{ marginBottom: 4, borderBottom: '1px solid #d9d9d9', paddingBottom: 4 }}
                  >
                    <Col span={6}><Text strong>Ürün</Text></Col>
                    <Col span={3}><Text strong>Adet</Text></Col>
                    <Col span={4}><Text strong>Birim Fiyat (₺)</Text></Col>
                    <Col span={3}><Text strong>İndirim %</Text></Col>
                    <Col span={4}><Text strong>İndirim Tutarı (₺)</Text></Col>
                    <Col span={3}><Text strong>Not</Text></Col>
                    <Col span={1}><Text strong>Sil</Text></Col>
                  </Row>

                  {fields.map(({ key, name, ...restField }) => (
                    <Row
                      key={key}
                      gutter={8}
                      align="middle"
                      style={{ marginBottom: 8 }}
                    >
                      {/* Hidden ID */}
                      <Form.Item {...restField} name={[name, 'id']} hidden>
                        <Input type="hidden" />
                      </Form.Item>

                      {/* Ürün Lookup */}
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'product']}
                          rules={[{ required: true, message: 'Ürün seçimi gereklidir' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <EntityLookup
                            onSearch={entitySearchService.search}
                            entityTypes={[EntityType.Product]}
                            multiple={false}
                            modalTitle="Ürün seçin..."
                          />
                        </Form.Item>
                      </Col>

                      {/* Adet */}
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          initialValue={1}
                          rules={[{ required: true, message: 'Gerekli' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>

                      {/* Birim Fiyat */}
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'unitPrice']}
                          initialValue={0}
                          rules={[{ required: true, message: 'Gerekli' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            formatter={(v) =>
                              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(v) =>
                              parseFloat(v?.replace(/,/g, '') || '0') as any
                            }
                          />
                        </Form.Item>
                      </Col>

                      {/* İndirim % */}
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, 'discountPercent']}
                          initialValue={0}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            style={{ width: '100%' }}
                            formatter={(v) => `%${v}`}
                            parser={(v) =>
                              parseFloat(v?.replace('%', '') || '0') as any
                            }
                          />
                        </Form.Item>
                      </Col>

                      {/* İndirim Tutarı */}
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, 'discountAmount']}
                          initialValue={0}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            formatter={(v) =>
                              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(v) =>
                              parseFloat(v?.replace(/,/g, '') || '0') as any
                            }
                          />
                        </Form.Item>
                      </Col>

                      {/* Not */}
                      <Col span={3}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="Not (opsiyonel)" />
                        </Form.Item>
                      </Col>

                      {/* Sil */}
                      <Col span={1}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          size="small"
                        />
                      </Col>
                    </Row>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        product: null,
                        quantity: 1,
                        unitPrice: 0,
                        discountPercent: 0,
                        discountAmount: 0,
                      })
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    Ürün Ekle
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Açıklama */}
        <Col span={24}>
          <Card
            title={<Space><FileTextOutlined /><span>Açıklama</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="description" label="Açıklama">
              <TextArea rows={4} placeholder="Fırsat hakkında notlar..." />
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
    />
  );
};

export default OpportunityDetail;