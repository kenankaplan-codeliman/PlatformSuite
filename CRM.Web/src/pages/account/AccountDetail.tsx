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
  Table,
  Button,
  Switch,
} from 'antd';
import {
  BankOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  DollarOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { RoutePaths } from '@/config/route.paths';
import type {
  AccountDetailItem,
  AccountContactRef,
} from '@/types/account.types';
import {
  AccountType,
  getAccountTypeLabel,
  getAccountTypeColor,
  getPhoneTypeLabel,
  getEmailTypeLabel,
  getAddressTypeLabel,
  accountTypeOptions,
  phoneTypeOptions,
  emailTypeOptions,
  addressTypeOptions,
  PhoneType,
  EmailType,
  AddressType,
} from '@/types/account.types';
import { useAccountStore } from '@/stores/account.store';
import ActivityListView from '@/components/ActivityListView';

import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import EntityLookup from '@/components/EntityLookup';
import { entitySearchService } from '@/services/entity.search.service';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Form satırı tipi: EntityLookup çıktısı + AccountContactRef alanları
interface ContactFormRow {
  id?: string;
  contact: EntityReference | null;
  role?: string;
  isPrimary?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AccountDetail: React.FC<DetailPageProps<AccountDetailItem>> = (props) => {
  const store = useAccountStore();
  const { t } = useTranslation('account');
  const { t: tc } = useTranslation('common');

  const [activeTab, setActiveTab] = useState<string>('details');
  const handleTabChange = useCallback((key: string) => setActiveTab(key), []);

  const detail = useDetailPage<AccountDetailItem>(
    {
      fetchById: (id) => store.fetchAccountById(id),
      createEntity: (values) => store.createAccount(values),
      updateEntity: (values) => store.updateAccount(values),
      deleteEntity: async (id) => {
        const { deleteAccount } = useAccountStore.getState();
        await deleteAccount(id);
      },
      currentEntity: store.currentAccount,
      clearCurrentEntity: () => store.setCurrentAccount(null),

      // Entity → Form dönüşümü
      mapEntityToForm: (entity) => ({
        ...entity,
        // AccountContactRef → form satırı: EntityLookup'ın anlayacağı EntityReference formatına çevir
        contacts: (entity.contacts ?? []).map((c) => ({
          id: c.id,
          contact: c.contactId
            ? ({ id: c.contactId, name: c.contactName, entityType: EntityType.Contact } as EntityReference)
            : null,
          role: c.role,
          isPrimary: c.isPrimary,
        })),
      }),

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        // Form satırı → AccountContactRef: EntityReference'ı geri çevir
        contacts: (values.contacts ?? [])
          .filter((c: ContactFormRow) => c.contact != null)
          .map((c: ContactFormRow) => ({
            id: c.id,
            contactId: c.contact.id,
            contactName: c.contact.name,
            role: c.role ?? undefined,
            isPrimary: c.isPrimary ?? false,
          })),
      }),

      // Yeni kayıt default'ları
      defaultFormValues: {
        accountType: AccountType.Prospect,
        emails: [],
        phones: [],
        addresses: [],
        contacts: [],
      },

      listPath: RoutePaths.Account.List,
      getViewPath: (entity) => RoutePaths.Account.View(entity.id),
    },
    props
  );

  const currentAccount = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentAccount?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignAccount(currentAccount.id, user);
    await store.fetchAccountById(currentAccount.id);
  }, [currentAccount?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentAccount?.id) return;
    if (isActive) {
      await store.deactivateAccount(currentAccount.id);
    } else {
      await store.activateAccount(currentAccount.id);
    }
    await store.fetchAccountById(currentAccount.id);
  }, [currentAccount?.id, store]);

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
                  {currentAccount?.accountName}
                </Title>
                <Tag color={getAccountTypeColor(currentAccount?.accountType ?? AccountType.Prospect)}>
                  {getAccountTypeLabel(currentAccount?.accountType ?? AccountType.Prospect)}
                </Tag>
                <Badge
                  status={currentAccount?.isActive ? 'success' : 'default'}
                  text={currentAccount?.isActive ? tc('status.active') : tc('status.inactive')}
                />
              </Space>
              {currentAccount?.industry && (
                <Text type="secondary">
                  <BankOutlined style={{ marginRight: 4 }} />
                  {currentAccount.industry}
                  {currentAccount.parentAccountName && ` · ${t('subField.parentPrefix')}${currentAccount.parentAccountName}`}
                </Text>
              )}
            </Space>
          </Col>
          <Col>
            {currentAccount?.annualRevenue && (
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary">{t('field.annualRevenue')}</Text>
                <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                  ₺{currentAccount.annualRevenue.toLocaleString('tr-TR')}
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
                {/* Firma Bilgileri */}
                <Col span={12}>
                  <Card
                    title={<Space><BankOutlined /><span>{t('section.companyInfo')}</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={t('field.industry')}>
                        {currentAccount?.industry || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.numberOfEmployees')}>
                        {currentAccount?.numberOfEmployees?.toLocaleString('tr-TR') || (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.annualRevenue')}>
                        {currentAccount?.annualRevenue
                          ? `₺${currentAccount.annualRevenue.toLocaleString('tr-TR')}`
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><GlobalOutlined /> {t('field.website')}</>}>
                        {currentAccount?.website ? (
                          <a href={currentAccount.website} target="_blank" rel="noopener noreferrer">
                            {currentAccount.website}
                          </a>
                        ) : (
                          <Text type="secondary">-</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.parentAccount')}>
                        {currentAccount?.parentAccountName || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Telefonlar */}
                <Col span={12}>
                  <Card
                    title={<Space><PhoneOutlined /><span>{t('section.phones')}</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    {currentAccount?.phones && currentAccount.phones.length > 0 ? (
                      <Descriptions column={1} size="small">
                        {currentAccount.phones.map((phone, idx) => (
                          <Descriptions.Item
                            key={phone.id || idx}
                            label={
                              <Space>
                                {getPhoneTypeLabel(phone.type)}
                                {phone.isPrimary && <Tag color="blue" style={{ fontSize: 10 }}>{t('subField.primary')}</Tag>}
                              </Space>
                            }
                          >
                            <a href={`tel:${phone.phoneNumber}`}>{phone.phoneNumber}</a>
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    ) : (
                      <Text type="secondary">{t('emptyState.phones')}</Text>
                    )}
                  </Card>
                </Col>

                {/* E-postalar */}
                <Col span={12}>
                  <Card
                    title={<Space><MailOutlined /><span>{t('section.emails')}</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    {currentAccount?.emails && currentAccount.emails.length > 0 ? (
                      <Descriptions column={1} size="small">
                        {currentAccount.emails.map((email, idx) => (
                          <Descriptions.Item
                            key={email.id || idx}
                            label={
                              <Space>
                                {getEmailTypeLabel(email.type)}
                                {email.isPrimary && <Tag color="blue" style={{ fontSize: 10 }}>{t('subField.primary')}</Tag>}
                              </Space>
                            }
                          >
                            <a href={`mailto:${email.email}`}>{email.email}</a>
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    ) : (
                      <Text type="secondary">{t('emptyState.emails')}</Text>
                    )}
                  </Card>
                </Col>

                {/* Adresler */}
                <Col span={12}>
                  <Card
                    title={<Space><EnvironmentOutlined /><span>{t('section.addresses')}</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    {currentAccount?.addresses && currentAccount.addresses.length > 0 ? (
                      currentAccount.addresses.map((address, idx) => (
                        <div key={address.id || idx} style={{ marginBottom: idx < currentAccount.addresses.length - 1 ? 12 : 0 }}>
                          <Space>
                            <Tag>{getAddressTypeLabel(address.type)}</Tag>
                            {address.isPrimary && <Tag color="blue" style={{ fontSize: 10 }}>{t('subField.primary')}</Tag>}
                          </Space>
                          <Paragraph style={{ margin: '4px 0 0' }}>
                            {address.addressLine1}
                            {address.addressLine2 && <>, {address.addressLine2}</>}
                            <br />
                            {[address.city, address.state, address.postalCode]
                              .filter(Boolean)
                              .join(', ')}
                            {address.country && <><br />{address.country}</>}
                          </Paragraph>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary">{t('emptyState.addresses')}</Text>
                    )}
                  </Card>
                </Col>

                {/* Kişiler */}
                {currentAccount?.contacts && currentAccount.contacts.length > 0 && (
                  <Col span={24}>
                    <Card
                      title={<Space><TeamOutlined /><span>{t('section.contacts')}</span></Space>}
                      style={{ marginBottom: 16 }}
                    >
                      <Table<AccountContactRef>
                        dataSource={currentAccount.contacts}
                        rowKey={(record) => record.id || record.contactId}
                        pagination={false}
                        size="small"
                        columns={[
                          {
                            title: tc('field.name'),
                            dataIndex: 'contactName',
                            key: 'contactName',
                            width: '42%',
                            render: (name: string) => (
                              <Space size={4}>
                                <UserOutlined style={{ color: '#8c8c8c' }} />
                                <Text>{name}</Text>
                              </Space>
                            ),
                          },
                          {
                            title: t('field.role'),
                            dataIndex: 'role',
                            key: 'role',
                            width: '42%',
                            render: (role: string) => role || <Text type="secondary">-</Text>,
                          },
                          {
                            title: t('subField.primary'),
                            dataIndex: 'isPrimary',
                            key: 'isPrimary',
                            align: 'center',
                            width: '16%',
                            render: (isPrimary: boolean) => (
                              <Badge status={isPrimary ? 'success' : 'default'} text={isPrimary ? tc('confirm.yes') : tc('confirm.no')} />
                            ),
                          },
                        ]}
                      />
                    </Card>
                  </Col>
                )}

                {/* Açıklama */}
                {currentAccount?.description && (
                  <Col span={24}>
                    <Card
                      title={<Space><FileTextOutlined /><span>{t('section.description')}</span></Space>}
                      style={{ marginBottom: 16 }}
                    >
                      <Paragraph>{currentAccount.description}</Paragraph>
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
                  regardingEntityType: EntityType.Account,
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
          <Card
            title={<Space><BankOutlined /><span>{t('section.basicInfo')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="accountName"
                  label={t('field.name')}
                  rules={[{ required: true, message: t('validation.nameRequired') }]}
                >
                  <Input prefix={<BankOutlined />} placeholder={t('placeholder.name')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="accountType"
                  label={t('field.accountType')}
                  rules={[{ required: true, message: t('validation.accountTypeRequired') }]}
                >
                  <Select options={accountTypeOptions} placeholder={t('placeholder.accountType')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="industry" label={t('field.industry')}>
                  <Input placeholder={t('placeholder.industry')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="website" label={t('field.website')}>
                  <Input prefix={<GlobalOutlined />} placeholder={t('placeholder.website')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="parentAccountId" label={t('field.parentAccount')}>
                  <Input placeholder={t('placeholder.parentAccount')} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Finansal Bilgiler */}
        <Col span={12}>
          <Card
            title={<Space><DollarOutlined /><span>{t('section.financialInfo')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="numberOfEmployees" label={t('field.numberOfEmployees')}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={t('placeholder.employees')}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/\$\s?|(,*)/g, '') || '0', 10) as number}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="annualRevenue" label={t('field.annualRevenueWithCurrency')}>
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={t('placeholder.annualRevenue')}
                    formatter={(value) => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => parseInt(value?.replace(/₺\s?|(,*)/g, '') || '0', 10) as number}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Telefonlar */}
        <Col span={12}>
          <Card
            title={<Space><PhoneOutlined /><span>{t('section.phones')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.List name="phones">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                      {/*  ID  Field */}
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        hidden
                      >
                        <Input type="hidden" />
                      </Form.Item>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'phoneNumber']}
                          rules={[{ required: true, message: t('validation.phoneRequired') }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder={t('placeholder.phoneNumber')} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          initialValue={PhoneType.Work}
                          style={{ marginBottom: 0 }}
                        >
                          <Select options={phoneTypeOptions} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'isPrimary']}
                          valuePropName="checked"
                          initialValue={false}
                          style={{ marginBottom: 0 }}
                        >
                          <Switch checkedChildren={t('subField.primary')} unCheckedChildren={t('subField.primary')} size="small" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
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
                  <Button type="dashed" onClick={() => add({ type: PhoneType.Work, isPrimary: false })} block icon={<PlusOutlined />}>
                    {t('action.addPhone')}
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* E-postalar */}
        <Col span={12}>
          <Card
            title={<Space><MailOutlined /><span>{t('section.emails')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.List name="emails">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                      {/*  ID  Field */}
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        hidden
                      >
                        <Input type="hidden" />
                      </Form.Item>

                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'email']}
                          rules={[
                            { required: true, message: t('validation.emailRequired') },
                            { type: 'email', message: t('validation.emailInvalid') },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder={t('placeholder.emailAddress')} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          initialValue={EmailType.Work}
                          style={{ marginBottom: 0 }}
                        >
                          <Select options={emailTypeOptions} />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'isPrimary']}
                          valuePropName="checked"
                          initialValue={false}
                          style={{ marginBottom: 0 }}
                        >
                          <Switch checkedChildren={t('subField.primary')} unCheckedChildren={t('subField.primary')} size="small" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
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
                  <Button type="dashed" onClick={() => add({ type: EmailType.Work, isPrimary: false })} block icon={<PlusOutlined />}>
                    {t('action.addEmail')}
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Adresler */}
        <Col span={12}>
          <Card
            title={<Space><EnvironmentOutlined /><span>{t('section.addresses')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.List name="addresses">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: 8 }}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          size="small"
                        />
                      }
                    >
                      <Row gutter={8}>
                        {/*  ID  Field */}
                        <Form.Item
                          {...restField}
                          name={[name, 'id']}
                          hidden
                        >
                          <Input type="hidden" />
                        </Form.Item>

                        <Col span={16}>
                          <Form.Item
                            {...restField}
                            name={[name, 'addressLine1']}
                            rules={[{ required: true, message: t('validation.addressLine1Required') }]}
                            style={{ marginBottom: 8 }}
                          >
                            <Input placeholder={t('placeholder.addressLine1')} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            initialValue={AddressType.Office}
                            style={{ marginBottom: 8 }}
                          >
                            <Select options={addressTypeOptions} />
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item
                            {...restField}
                            name={[name, 'addressLine2']}
                            style={{ marginBottom: 8 }}
                          >
                            <Input placeholder={t('placeholder.addressLine2')} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'isPrimary']}
                            valuePropName="checked"
                            initialValue={false}
                            style={{ marginBottom: 8 }}
                          >
                            <Switch checkedChildren={t('subField.primary')} unCheckedChildren={t('subField.primary')} size="small" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'city']} style={{ marginBottom: 0 }}>
                            <Input placeholder={t('placeholder.city')} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'state']} style={{ marginBottom: 0 }}>
                            <Input placeholder={t('placeholder.state')} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'postalCode']} style={{ marginBottom: 0 }}>
                            <Input placeholder={t('placeholder.postalCode')} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'country']} style={{ marginBottom: 0 }}>
                            <Input placeholder={t('placeholder.country')} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ type: AddressType.Office, isPrimary: false })}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t('action.addAddress')}
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* İlişkili Kişiler */}
        <Col span={24}>
          <Card
            title={<Space><TeamOutlined /><span>{t('section.contacts')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.List name="contacts">
              {(fields, { add, remove }) => (
                <>
                  <Row
                    gutter={8}
                    align="middle"
                    style={{ marginBottom: 4, borderBottom: '1px solid #d9d9d9' }}
                  >
                    <Col span={10}>
                      <Text strong>{tc('field.name')}</Text>
                    </Col>
                    <Col span={10}>
                      <Text strong>{t('field.role')}</Text>
                    </Col>
                    <Col span={2}>
                      <Text strong>{t('subField.primary')}</Text>
                    </Col>
                    <Col span={2}>
                      <Text strong>{tc('action.delete')}</Text>
                    </Col>
                  </Row>

                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={8} align="middle" style={{ marginBottom: 4 }}>
                      {/* Mevcut junction kaydının ID'si */}
                      <Form.Item {...restField} name={[name, 'id']} hidden>
                        <Input type="hidden" />
                      </Form.Item>

                      {/* Kişi seçimi — EntityLookup Contact tipinde, tekli seçim */}
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'contact']}
                          rules={[{ required: true, message: t('validation.contactRequired') }]}
                          style={{ marginBottom: 0 }}
                        >
                          <EntityLookup
                            onSearch={entitySearchService.search}
                            entityTypes={[EntityType.Contact]}
                            multiple={false}
                            modalTitle={t('action.selectContact')}
                          />
                        </Form.Item>
                      </Col>

                      {/* Rol */}
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'role']}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder={t('placeholder.role')} />
                        </Form.Item>
                      </Col>

                      {/* Birincil */}
                      <Col span={2}>
                        <Form.Item
                          {...restField}
                          name={[name, 'isPrimary']}
                          valuePropName="checked"
                          initialValue={false}
                          style={{ marginBottom: 0 }}
                        >
                          <Switch checkedChildren={tc('confirm.yes')} unCheckedChildren={tc('confirm.no')} size="small" />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
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
                    onClick={() => add({ contact: null, role: undefined, isPrimary: false })}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t('action.addContact')}
                  </Button>
                </>
              )}
            </Form.List>
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

  // ─── Layout ─────────────────────────────────────────────────────────────

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
      entityExists={!!currentAccount}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentAccount?.isActive}
      onStateChange={handleStateChange}
      entityId={currentAccount?.id}
      entityType={EntityType.Account}
    />
  );
};

export default AccountDetail;
