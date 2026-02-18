import React from 'react';
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
} from '@ant-design/icons';
import type { DetailMode } from '@/hooks/useDetailPage';

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
  notFoundTitle,
  notFoundDescription,
  entityExists,
  renderViewMode,
  renderEditMode,
  renderExtraViewActions,
}) => {
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
              <Divider type="vertical" />
              <Title level={4} style={{ margin: 0 }}>
                {pageTitle}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              {isViewMode && !isNew && (
                <>
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
                  {renderExtraViewActions?.()}
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