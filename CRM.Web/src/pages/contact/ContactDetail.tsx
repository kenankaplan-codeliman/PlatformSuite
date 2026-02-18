import React, { useState, useCallback } from 'react';
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

// ─── Component ────────────────────────────────────────────────────────────────

const ContactDetail: React.FC<DetailPageProps<ContactDetailItem>> = (props) => {
  const store = useContactStore();

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
          .filter((ac: any) => ac.account != null)
          .map((ac: any) => ({
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
            <Space direction="vertical" size={4}>
              <Space align="center">
                <Title level={3} style={{ margin: 0 }}>
                  {fullName}
                </Title>
                <Badge
                  status={currentContact?.isActive ? 'success' : 'default'}
                  text={currentContact?.isActive ? 'Aktif' : 'Pasif'}
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
            label: 'Detaylar',
            children: (
              <Row gutter={16}>
                {/* Kişi Bilgileri */}
                <Col span={12}>
                  <Card
                    title={<Space><IdcardOutlined /><span>Kişi Bilgileri</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Unvan">
                        {currentContact?.title || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Departman">
                        {currentContact?.department || <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Doğum Tarihi">
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
                    title={<Space><PhoneOutlined /><span>Telefonlar</span></Space>}
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
                                  <Tag color="blue" style={{ fontSize: 10 }}>Birincil</Tag>
                                )}
                              </Space>
                            }
                          >
                            <a href={`tel:${phone.phoneNumber}`}>{phone.phoneNumber}</a>
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    ) : (
                      <Text type="secondary">Kayıtlı telefon yok</Text>
                    )}
                  </Card>
                </Col>

                {/* E-postalar */}
                <Col span={12}>
                  <Card
                    title={<Space><MailOutlined /><span>E-postalar</span></Space>}
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
                                  <Tag color="blue" style={{ fontSize: 10 }}>Birincil</Tag>
                                )}
                              </Space>
                            }
                          >
                            <a href={`mailto:${email.email}`}>{email.email}</a>
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    ) : (
                      <Text type="secondary">Kayıtlı e-posta yok</Text>
                    )}
                  </Card>
                </Col>

                {/* Adresler */}
                <Col span={12}>
                  <Card
                    title={<Space><EnvironmentOutlined /><span>Adresler</span></Space>}
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
                              <Tag color="blue" style={{ fontSize: 10 }}>Birincil</Tag>
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
                      <Text type="secondary">Kayıtlı adres yok</Text>
                    )}
                  </Card>
                </Col>

                {/* Bağlı Firmalar (many-to-many) */}
                {currentContact?.accountContacts && currentContact.accountContacts.length > 0 && (
                  <Col span={24}>
                    <Card
                      title={<Space><BankOutlined /><span>Bağlı Firmalar</span></Space>}
                      style={{ marginBottom: 16 }}
                    >
                      <Table<ContactAccountRef>
                        dataSource={currentContact.accountContacts}
                        rowKey={(record) => record.id || record.accountId}
                        pagination={false}
                        size="small"
                        columns={[
                          {
                            title: 'Firma',
                            dataIndex: 'accountName',
                            key: 'accountName',
                            render: (name: string) => (
                              <Space size={4}>
                                <BankOutlined style={{ color: '#8c8c8c' }} />
                                <Text>{name}</Text>
                              </Space>
                            ),
                          },
                          {
                            title: 'Rol',
                            dataIndex: 'role',
                            key: 'role',
                            render: (role: string) => role || <Text type="secondary">-</Text>,
                          },
                          {
                            title: 'Birincil',
                            dataIndex: 'isPrimary',
                            key: 'isPrimary',
                            width: 80,
                            align: 'center',
                            render: (isPrimary: boolean) => (
                              <Badge
                                status={isPrimary ? 'success' : 'default'}
                                text={isPrimary ? 'Evet' : 'Hayır'}
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
                    title={<Space><ClockCircleOutlined /><span>Kayıt Bilgileri</span></Space>}
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Oluşturulma">
                        {currentContact?.createdAt
                          ? dayjs(currentContact.createdAt).format('DD.MM.YYYY HH:mm')
                          : <Text type="secondary">-</Text>}
                      </Descriptions.Item>
                      <Descriptions.Item label="Son Güncelleme">
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
                      title={<Space><FileTextOutlined /><span>Açıklama</span></Space>}
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
            label: 'Aktiviteler',
            children: (
              <ActivityListView
                initialFilters={{
                  regardingEntityId: detail.entityId,
                  regardingEntityType: EntityType.Contact,
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

  // ─── Edit Mode ──────────────────────────────────────────────────────────

  const renderEditMode = () => (
    <Form form={detail.form} layout="vertical">
      <Row gutter={24}>
        {/* Temel Bilgiler */}
        <Col span={24}>
          <Card
            title={<Space><UserOutlined /><span>Temel Bilgiler</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16}>
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
                <Form.Item name="title" label="Unvan">
                  <Input prefix={<IdcardOutlined />} placeholder="Unvan girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="department" label="Departman">
                  <Input placeholder="Departman girin" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="birthDate" label="Doğum Tarihi">
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD.MM.YYYY"
                    placeholder="Tarih seçin"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
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

        {/* Telefonlar */}
        <Col span={12}>
          <Card
            title={<Space><PhoneOutlined /><span>Telefonlar</span></Space>}
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
                          rules={[{ required: true, message: 'Telefon gerekli' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="Telefon numarası" />
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
                          <Switch checkedChildren="Birincil" unCheckedChildren="Birincil" size="small" />
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
                    Telefon Ekle
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* E-postalar */}
        <Col span={12}>
          <Card
            title={<Space><MailOutlined /><span>E-postalar</span></Space>}
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
                            { required: true, message: 'E-posta gerekli' },
                            { type: 'email', message: 'Geçerli bir e-posta girin' },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="E-posta adresi" />
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
                          <Switch checkedChildren="Birincil" unCheckedChildren="Birincil" size="small" />
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
                    E-posta Ekle
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Adresler */}
        <Col span={12}>
          <Card
            title={<Space><EnvironmentOutlined /><span>Adresler</span></Space>}
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
                            rules={[{ required: true, message: 'Adres satırı 1 gerekli' }]}
                            style={{ marginBottom: 8 }}
                          >
                            <Input placeholder="Adres Satırı 1" />
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
                            <Input placeholder="Adres Satırı 2 (opsiyonel)" />
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
                            <Switch checkedChildren="Birincil" unCheckedChildren="Birincil" size="small" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'city']} style={{ marginBottom: 0 }}>
                            <Input placeholder="Şehir" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'state']} style={{ marginBottom: 0 }}>
                            <Input placeholder="İl/Eyalet" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'postalCode']} style={{ marginBottom: 0 }}>
                            <Input placeholder="Posta Kodu" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item {...restField} name={[name, 'country']} style={{ marginBottom: 0 }}>
                            <Input placeholder="Ülke" />
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
                    Adres Ekle
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
        </Col>

        {/* Bağlı Firmalar */}
        <Col span={24}>
          <Card
            title={<Space><BankOutlined /><span>Bağlı Firmalar</span></Space>}
            style={{ marginBottom: 16 }}
          >
            <Form.List name="accountContacts">
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
                      <Row gutter={8} align="middle">
                        {/* Mevcut junction kaydının ID'si */}
                        <Form.Item {...restField} name={[name, 'id']} hidden>
                          <Input type="hidden" />
                        </Form.Item>

                        {/* Firma seçimi — EntityLookup Account tipinde, tekli seçim */}
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'account']}
                            label="Firma"
                            rules={[{ required: true, message: 'Firma seçimi gereklidir' }]}
                            style={{ marginBottom: 0 }}
                          >
                            <EntityLookup
                              onSearch={entitySearchService.search}
                              entityTypes={[EntityType.Account]}
                              multiple={false}
                              modalTitle="Firma seçin..."
                            />
                          </Form.Item>
                        </Col>

                        {/* Rol */}
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'role']}
                            label="Rol"
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Rol girin (opsiyonel)" />
                          </Form.Item>
                        </Col>

                        {/* Birincil */}
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'isPrimary']}
                            label="Birincil"
                            valuePropName="checked"
                            initialValue={false}
                            style={{ marginBottom: 0 }}
                          >
                            <Switch checkedChildren="Evet" unCheckedChildren="Hayır" size="small" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ account: null, role: undefined, isPrimary: false })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Firma Ekle
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
              <TextArea rows={4} placeholder="Kişi hakkında notlar..." />
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
        create: 'Yeni Kişi',
        view: 'Kişi Detayı',
        edit: 'Kişi Düzenle',
      }}
      deleteConfirm={{
        title: 'Kişi Silme',
        description: 'Bu kişiyi silmek istediğinizden emin misiniz?',
      }}
      notFoundTitle="Kişi Bulunamadı"
      notFoundDescription="Aradığınız kişi bulunamadı veya silinmiş olabilir."
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
    />
  );
};

export default ContactDetail;