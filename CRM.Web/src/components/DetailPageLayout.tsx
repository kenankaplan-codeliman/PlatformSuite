import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { DetailMode } from '@/hooks/useDetailPage';
import EntityLookup from '@/components/EntityLookup';
import { EntityType, type EntityReference, type EntityTypeValue } from '@/types/entity.lookup.types';
import { entitySearchService } from '@/services/entity.search.service';
import AuditCard from '@/components/AuditCard';
import type { AuditInfo } from '@/types/common.types';
import auditService from '@/services/audit.service';

const { Title, Text } = Typography;

export interface DetailPageLayoutProps {
  /** Sayfa başlığı */
  title: {
    create: string;
    view: string;
    edit: string;
  };

  /** Silme onay mesajları */
  deleteConfirm: {
    title: string;
    description: string;
  };

  /** Mevcut mod */
  mode: DetailMode;
  isNew: boolean;
  isViewMode: boolean;
  isEditMode: boolean;
  isCreateMode: boolean;
  isLoading: boolean;

  /** Handlers */
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;

  /**
   * Kullanıcı atama handler'ı.
   * Tanımlandığında toolbar'da "Ata" butonu ve kullanıcı seçim modalı otomatik gösterilir.
   */
  onAssign?: (entity: EntityReference | EntityReference[] | null) => void | Promise<void>;

  /**
   * Aktivasyon/deaktivasyon handler'ı.
   * Tanımlandığında entityIsActive durumuna göre toggle butonu gösterilir.
   * isActive=true ise deactivate, false ise activate çağrılmalıdır.
   */
  entityIsActive?: boolean;
  onStateChange?: (isActive: boolean) => void | Promise<void>;

  /** Entity bulunamadı ekranı mesajları */
  notFoundTitle: string;
  notFoundDescription: string;

  /** Entity mevcut mu? */
  entityExists: boolean;

  /** View mode içeriği */
  renderViewMode: () => React.ReactNode;

  /** Edit/Create mode içeriği (Form) */
  renderEditMode: () => React.ReactNode;

  /** İsteğe bağlı: Toolbar'a ekstra butonlar */
  renderExtraViewActions?: () => React.ReactNode;

  /**
   * Audit bilgilerini otomatik çekmek için entity bilgileri.
   * İkisi de tanımlandığında entity yüklenince audit servisi çağrılır,
   * dönen AuditInfo her iki modda da footer'da gösterilir.
   */
  entityId?: string;
  entityType?: EntityTypeValue;
}

const DetailPageLayout: React.FC<DetailPageLayoutProps> = ({
  title,
  deleteConfirm,
  isNew,
  isViewMode,
  isEditMode,
  isCreateMode,
  isLoading,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onBack,
  onAssign,
  entityIsActive,
  onStateChange,
  notFoundTitle,
  notFoundDescription,
  entityExists,
  renderViewMode,
  renderEditMode,
  renderExtraViewActions,
  entityId,
  entityType,
}) => {
  const { t } = useTranslation();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [auditInfo, setAuditInfo] = useState<AuditInfo | null>(null);

  useEffect(() => {
    if (!entityId || !entityType || !isViewMode) {
      setAuditInfo(null);
      return;
    }
    auditService
      .getAuditInfo({ entityType, id: entityId })
      .then((info) => setAuditInfo(info ?? null))
      .catch(() => setAuditInfo(null));
  }, [entityId, entityType, isViewMode]);

  const handleAssignChange = async (entity: EntityReference | EntityReference[] | null) => {
    if (!onAssign) return;
    await onAssign(entity);
    setAssignModalOpen(false);
  };

  // ─── Not Found ──────────────────────────────────────────────────────────
  if (!entityExists && !isNew && !isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4} type="warning">
              {notFoundTitle}
            </Title>
            <Text type="secondary">{notFoundDescription}</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={onBack}>
                {t('action.backTo')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ─── Loading ────────────────────────────────────────────────────────────
  if (isLoading && !isNew) {
    return null;
  }

  // ─── Page Title ─────────────────────────────────────────────────────────
  const pageTitle = isNew ? title.create : isViewMode ? title.view : title.edit;

  return (
    <div style={{ padding: 24 }}>
      {/* ─── Toolbar ────────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <Tooltip title={t('action.back')}>
                <Button icon={<ArrowLeftOutlined />} onClick={onBack} />
              </Tooltip>
              <Divider orientation="vertical" />
              <Title level={4} style={{ margin: 0 }}>
                {pageTitle}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNew && (
                <>
                  {renderExtraViewActions?.()}

                  {/* ─── Assign Button ──────────────────────────────────── */}
                  {onAssign && (
                    <>
                      <Button
                        icon={<UserAddOutlined />}
                        onClick={() => setAssignModalOpen(true)}
                      >
                        {t('action.assign')}
                      </Button>
                      <EntityLookup
                        open={assignModalOpen}
                        onOpenChange={setAssignModalOpen}
                        onSearch={entitySearchService.search}
                        entityTypes={[EntityType.User]}
                        multiple={false}
                        modalTitle={t('action.assignUser')}
                        onChange={handleAssignChange}
                      />
                    </>
                  )}

                  {/* ─── Activate / Deactivate Toggle Button ────────────── */}
                  {onStateChange && (
                    entityIsActive ? (
                      <Popconfirm
                        title={t('action.deactivate')}
                        description={t('confirm.pageDeactivateContent')}
                        onConfirm={() => onStateChange(true)}
                        okText={t('action.deactivate')}
                        cancelText={t('action.cancel')}
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger icon={<StopOutlined />}>
                          {t('action.deactivate')}
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title={t('action.activate')}
                        description={t('confirm.pageActivateContent')}
                        onConfirm={() => onStateChange(false)}
                        okText={t('action.activate')}
                        cancelText={t('action.cancel')}
                        okButtonProps={{ style: { backgroundColor: '#52c41a', borderColor: '#52c41a' } }}
                      >
                        <Button icon={<CheckCircleOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>
                          {t('action.activate')}
                        </Button>
                      </Popconfirm>
                    )
                  )}

                  <Popconfirm
                    title={deleteConfirm.title}
                    description={deleteConfirm.description}
                    onConfirm={onDelete}
                    okText={t('action.delete')}
                    cancelText={t('action.cancel')}
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      {t('action.delete')}
                    </Button>
                  </Popconfirm>
                  <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
                    {t('action.edit')}
                  </Button>
                </>
              )}

              {(isEditMode || isCreateMode) && (
                <>
                  <Button icon={<CloseOutlined />} onClick={onCancelEdit}>
                    {t('action.cancel')}
                  </Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
                    {isNew ? t('action.create') : t('action.save')}
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ─── Content ────────────────────────────────────────────────────── */}
      {isViewMode ? renderViewMode() : renderEditMode()}

      {/* ─── Audit Footer ────────────────────────────────────────────────── */}
      {auditInfo && (
        <AuditCard
          audit={auditInfo}
          layout="horizontal"
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default DetailPageLayout;