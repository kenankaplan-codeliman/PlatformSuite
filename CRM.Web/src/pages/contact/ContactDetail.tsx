import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Form,
  Input,
  Select,
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
  Avatar,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { RoutePaths } from '@/config/route.paths';
import type {
  ContactDetailItem,
  ContactPhone,
  ContactEmail,
  ContactAddress,
  ContactAccountRef,
} from '@/types/contact.types';
import {
  getPhoneTypeLabel,
  getEmailTypeLabel,
  getAddressTypeLabel,
  phoneTypeOptions,
  emailTypeOptions,
  addressTypeOptions,
  PhoneType,
  EmailType,
  AddressType,
} from '@/types/contact.types';
import { useContactStore } from '@/stores/contact.store';
import ActivityListView from '@/components/ActivityListView';
import { useDetailPage, type DetailPageProps } from '@/hooks/useDetailPage';
import DetailPageLayout from '@/components/DetailPageLayout';
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import EntityLookup from '@/components/EntityLookup';
import { entitySearchService } from '@/services/entity.search.service';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Form satırı tipi: EntityLookup çıktısı + ContactAccountRef alanları
interface AccountFormRow {
  id?: string;
  account: EntityReference | null;
  role?: string;
  isPrimary?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ContactDetail: React.FC<DetailPageProps<ContactDetailItem>> = (props) => {
  const store = useContactStore();
  const { t } = useTranslation('contact');
  const { t: tc } = useTranslation('common');

  const [activeTab, setActiveTab] = useState<string>('details');
  const handleTabChange = useCallback((key: string) => setActiveTab(key), []);

  const detail = useDetailPage<ContactDetailItem>(
    {
      fetchById: (id) => store.fetchContactById(id),
      createEntity: (values) => store.createContact(values),
      updateEntity: (values) => store.updateContact(values),
      deleteEntity: async (id) => {
        const { deleteContact } = useContactStore.getState();
        await deleteContact(id);
      },
      currentEntity: store.currentContact,
      clearCurrentEntity: () => store.setCurrentContact(null),

      // Entity → Form dönüşümü
      mapEntityToForm: (entity) => ({
        ...entity,
        birthDate: entity.birthDate ? dayjs(entity.birthDate) : undefined,
        // ContactAccountRef → form satırı: EntityLookup'ın anlayacağı EntityReference formatına çevir
        accountContacts: (entity.accountContacts ?? []).map((ac) => ({
          id: ac.id,
          account: ac.accountId
            ? ({ id: ac.accountId, name: ac.accountName, entityType: EntityType.Account } as EntityReference)
            : null,
          role: ac.role,
          isPrimary: ac.isPrimary,
        })),
      }),

      // Form → Entity dönüşümü
      mapFormToEntity: (values, id) => ({
        ...values,
        id: id || undefined,
        birthDate: values.birthDate
          ? dayjs(values.birthDate).format('YYYY-MM-DD')
          : undefined,
        // Form satırı → ContactAccountRef: EntityReference'ı geri çevir
        accountContacts: (values.accountContacts ?? [])
          .filter((ac: AccountFormRow) => ac.account != null)
          .map((ac: AccountFormRow) => ({
            id: ac.id,
            accountId: ac.account.id,
            accountName: ac.account.name,
            role: ac.role ?? undefined,
            isPrimary: ac.isPrimary ?? false,
          })),
      }),

      // Yeni kayıt default'ları
      defaultFormValues: {
        emails: [],
        phones: [],
        addresses: [],
        accountContacts: [],
      },

      listPath: RoutePaths.Contact.List,
      getViewPath: (entity) => RoutePaths.Contact.View(entity.id),
    },
    props
  );

  const currentContact = detail.currentEntity;

  // ─── Assign Handler ─────────────────────────────────────────────────────
  const handleAssign = useCallback(async (entity: EntityReference | EntityReference[] | null) => {
    if (!entity || !currentContact?.id) return;
    const user = Array.isArray(entity) ? entity[0] : entity;
    await store.assignContact(currentContact.id, user);
    await store.fetchContactById(currentContact.id);
  }, [currentContact?.id, store]);

  // ─── Activate / Deactivate Handler ──────────────────────────────────────
  const handleStateChange = useCallback(async (isActive: boolean) => {
    if (!currentContact?.id) return;
    if (isActive) {
      await store.deactivateContact(currentContact.id);
    } else {
      await store.activateContact(currentContact.id);
    }
    await store.fetchContactById(currentContact.id);
  }, [currentContact?.id, store]);

  const fullName = currentContact
    ? `${currentContact.firstName} ${currentContact.lastName}`.trim()
    : '';

  // Birincil firma: accountContacts içinde isPrimary olan ilk kayıt
  const primaryAccount = currentContact?.accountContacts?.find((a) => a.isPrimary)
    ?? currentContact?.accountContacts?.[0];

  // ─── View Mode ──────────────────────────────────────────────────────────

  const renderViewMode = () => (
    <>
      {/* Header Info */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={24} align="middle">
          <Col flex="none">
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col flex="auto">
            <Space orientation="vertical" size={4}>
              <Space align="center">
                <Title level={3} style={{ margin: 0 }}>
                  {fullName}
                </Title>
                <Badge
                  status={currentContact?.isActive ? 'success' : 'default'}
                  text={currentContact?.isActive ? tc('status.active') : tc('status.inactive')}
                />
              </Space>
              {(currentContact?.title || currentContact?.department) && (
                <Text type="secondary">
                  <IdcardOutlined style={{ marginRight: 4 }} />
                  {[currentContact.title, currentContact.department]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
              )}
              {primaryAccount && (
                <Text type="secondary">
                  <BankOutlined style={{ marginRight: 4 }} />
                  {primaryAccount.accountName}
                  {primaryAccount.role && ` · ${primaryAccount.role}`}
                </Text>
              )}
            </Space>
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
                {/* Kişi Bilgileri */}
                <Col span={12}>
                  <Card
                    title={<Space><IdcardOutlined /><span>{t('section.contactInfo')}</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={t('field.title')}>
                        {currentContact?.title || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.department')}>
                        {currentContact?.department || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('field.birthDate')}>
                        {currentContact?.birthDate
                          ? dayjs(currentContact.birthDate).format('DD.MM.YYYY')
                          : <Text type="secondary">-</Text>}
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
                    {currentContact?.phones && currentContact.phones.length > 0 ? (
                      <Descriptions column={1} size="small">
                        {currentContact.phones.map((phone: ContactPhone, idx: number) => (
                          <Descriptions.Item
                            key={phone.id || idx}
                            label={
                              <Space>
                                {getPhoneTypeLabel(phone.type)}
                                {phone.isPrimary && (
                                  <Tag color="blue" style={{ fontSize: 10 }}>{t('subField.primary')}</Tag>
                                )}
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
                    {currentContact?.emails && currentContact.emails.length > 0 ? (
                      <Descriptions column={1} size="small">
                        {currentContact.emails.map((email: ContactEmail, idx: number) => (
                          <Descriptions.Item
                            key={email.id || idx}
                            label={
                              <Space>
                                {getEmailTypeLabel(email.type)}
                                {email.isPrimary && (
                                  <Tag color="blue" style={{ fontSize: 10 }}>{t('subField.primary')}</Tag>
                                )}
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
                    {currentContact?.addresses && currentContact.addresses.length > 0 ? (
                      currentContact.addresses.map((address: ContactAddress, idx: number) => (
                        <div
                          key={address.id || idx}
                          style={{
                            marginBottom:
                              idx < currentContact.addresses.length - 1 ? 12 : 0,
                          }}
                        >
                          <Space>
                            <Tag>{getAddressTypeLabel(address.type)}</Tag>
                            {address.isPrimary && (
                              <Tag color="blue" style={{ fontSize: 10 }}>{t('subField.primary')}</Tag>
                            )}
                          </Space>
                          <Paragraph style={{ margin: '4px 0 0' }}>
                            {address.addressLine1}
                            {address.addressLine2 && <>, {address.addressLine2}</>}
                            <br />
                            {[address.city, address.state, address.postalCode]
                              .filter(Boolean)
                              .join(', ')}
                            {address.country && (
                              <>
                                <br />
                                {address.country}
                              </>
                            )}
                          </Paragraph>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary">{t('emptyState.addresses')}</Text>
                    )}
                  </Card>
                </Col>

                {/* Bağlı Firmalar (many-to-many) */}
                {currentContact?.accountContacts && currentContact.accountContacts.length > 0 && (
                  <Col span={24}>
                    <Card
                      title={<Space><BankOutlined /><span>{t('section.accounts')}</span></Space>}
                      style={{ marginBottom: 16 }}
                    >
                      <Table<ContactAccountRef>
                        dataSource={currentContact.accountContacts}
                        rowKey={(record) => record.id || record.accountId}
                        pagination={false}
                        size="small"
                        columns={[
                          {
                            title: t('field.company'),
                            dataIndex: 'accountName',
                            key: 'accountName',
                            width: '42%',
                            render: (name: string) => (
                              <Space size={4}>
                                <BankOutlined style={{ color: '#8c8c8c' }} />
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
                              <Badge
                                status={isPrimary ? 'success' : 'default'}
                                text={isPrimary ? tc('confirm.yes') : tc('confirm.no')}
                              />
                            ),
                          },
                        ]}
                      />
                    </Card>
                  </Col>
                )}

                {/* Kayıt Bilgileri */}
                <Col span={12}>
                  <Card
                    title={<Space><ClockCircleOutlined /><span>{t('section.recordInfo')}</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={t('subField.createdAt')}>
                        {currentContact?.createdAt
                          ? dayjs(currentContact.createdAt).format('DD.MM.YYYY HH:mm')
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('subField.updatedAt')}>
                        {currentContact?.updatedAt
                          ? dayjs(currentContact.updatedAt).format('DD.MM.YYYY HH:mm')
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* Açıklama */}
                {currentContact?.description && (
                  <Col span={24}>
                    <Card
                      title={<Space><FileTextOutlined /><span>{t('section.description')}</span></Space>}
                      style={{ marginBottom: 16 }}
                    >
                      <Paragraph>{currentContact.description}</Paragraph>
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
                  regardingEntityType: EntityType.Contact,
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
            title={<Space><UserOutlined /><span>{t('section.basicInfo')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="firstName"
                  label={t('field.firstName')}
                  rules={[{ required: true, message: t('validation.firstNameRequired') }]}
                >
                  <Input prefix={<UserOutlined />} placeholder={t('placeholder.firstName')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="lastName"
                  label={t('field.lastName')}
                  rules={[{ required: true, message: t('validation.lastNameRequired') }]}
                >
                  <Input placeholder={t('placeholder.lastName')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="title" label={t('field.title')}>
                  <Input prefix={<IdcardOutlined />} placeholder={t('placeholder.title')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="department" label={t('field.department')}>
                  <Input placeholder={t('placeholder.department')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="birthDate" label={t('field.birthDate')}>
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    placeholder={t('placeholder.birthDate')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="isActive"
                  label={t('field.status')}
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren={tc('status.active')} unCheckedChildren={tc('status.inactive')} />
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
                      <Form.Item {...restField} name={[name, 'id']} hidden>
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
                  <Button
                    type="dashed"
                    onClick={() => add({ type: PhoneType.Work, isPrimary: false })}
                    block
                    icon={<PlusOutlined />}
                  >
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
                      <Form.Item {...restField} name={[name, 'id']} hidden>
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
                  <Button
                    type="dashed"
                    onClick={() => add({ type: EmailType.Work, isPrimary: false })}
                    block
                    icon={<PlusOutlined />}
                  >
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
                        <Form.Item {...restField} name={[name, 'id']} hidden>
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

        {/* Bağlı Firmalar */}
        <Col span={24}>
          <Card
            title={<Space><BankOutlined /><span>{t('section.accounts')}</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.List name="accountContacts">
              {(fields, { add, remove }) => (
                <>
                  <Row
                    gutter={8}
                    align="middle"
                    style={{ marginBottom: 4, borderBottom: "1px solid #d9d9d9" }}
                  >
                    <Col span={10}>
                      <Text strong>{t('field.company')}</Text>
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
                        <Row
                          key={key}
                          gutter={8}
                          align="middle"
                          style={{ marginBottom: 4 }}
                        >
                        {/* Mevcut junction kaydının ID'si */}
                        <Form.Item {...restField} name={[name, 'id']} hidden>
                          <Input type="hidden" />
                        </Form.Item>

                        {/* Firma seçimi — EntityLookup Account tipinde, tekli seçim */}
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'account']}
                            // label="Firma"
                            rules={[{ required: true, message: t('validation.accountRequired') }]}
                            style={{ marginBottom: 0 }}
                          >
                            <EntityLookup
                              onSearch={entitySearchService.search}
                              entityTypes={[EntityType.Account]}
                              multiple={false}
                              modalTitle={t('placeholder.selectAccount')}
                            />
                          </Form.Item>
                        </Col>

                        {/* Rol */}
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, 'role']}
                            // label="Rol"
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
                            // label="Birincil"
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
                    onClick={() => add({ account: null, role: undefined, isPrimary: false })}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t('action.addAccount')}
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
      entityExists={!!currentContact}
      onEdit={detail.handleEdit}
      onCancelEdit={detail.handleCancelEdit}
      onSave={detail.handleSave}
      onDelete={detail.handleDelete}
      onBack={detail.handleBack}
      renderViewMode={renderViewMode}
      renderEditMode={renderEditMode}
      onAssign={handleAssign}
      entityIsActive={currentContact?.isActive}
      onStateChange={handleStateChange}
      entityId={currentContact?.id}
      entityType={EntityType.Contact}
    />
  );
};

export default ContactDetail;