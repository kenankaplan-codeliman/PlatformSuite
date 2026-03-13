import React, { useState } from 'react';
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
import { EntityType, type EntityReference } from '@/types/entity.lookup.types';
import { entitySearchService } from '@/services/entity.search.service';

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
}) => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);

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
                Geri Dön
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
              <Tooltip title="Geri">
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
                        Ata
                      </Button>
                      <EntityLookup
                        open={assignModalOpen}
                        onOpenChange={setAssignModalOpen}
                        onSearch={entitySearchService.search}
                        entityTypes={[EntityType.User]}
                        multiple={false}
                        modalTitle="Kullanıcı ata..."
                        onChange={handleAssignChange}
                      />
                    </>
                  )}

                  {/* ─── Activate / Deactivate Toggle Button ────────────── */}
                  {onStateChange && (
                    entityIsActive ? (
                      <Popconfirm
                        title="Pasifleştir"
                        description="Bu kaydı pasifleştirmek istediğinizden emin misiniz?"
                        onConfirm={() => onStateChange(true)}
                        okText="Pasifleştir"
                        cancelText="İptal"
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger icon={<StopOutlined />}>
                          Pasifleştir
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title="Etkinleştir"
                        description="Bu kaydı etkinleştirmek istediğinizden emin misiniz?"
                        onConfirm={() => onStateChange(false)}
                        okText="Etkinleştir"
                        cancelText="İptal"
                        okButtonProps={{ style: { backgroundColor: '#52c41a', borderColor: '#52c41a' } }}
                      >
                        <Button icon={<CheckCircleOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}>
                          Etkinleştir
                        </Button>
                      </Popconfirm>
                    )
                  )}

                  <Popconfirm
                    title={deleteConfirm.title}
                    description={deleteConfirm.description}
                    onConfirm={onDelete}
                    okText="Sil"
                    cancelText="İptal"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Sil
                    </Button>
                  </Popconfirm>
                  <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
                    Düzenle
                  </Button>
                </>
              )}

              {(isEditMode || isCreateMode) && (
                <>
                  <Button icon={<CloseOutlined />} onClick={onCancelEdit}>
                    İptal
                  </Button>
                  <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
                    {isNew ? 'Oluştur' : 'Kaydet'}
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* ─── Content ────────────────────────────────────────────────────── */}
      {isViewMode ? renderViewMode() : renderEditMode()}
    </div>
  );
};

export default DetailPageLayout;