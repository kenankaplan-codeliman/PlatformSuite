import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Card,
  Modal,
  Input,
  Select,
  Button,
  Table,
  Space,
  Tag,
  Typography,
  Empty,
  Spin,
  Tooltip,
  Avatar,
} from 'antd';
import type { TableProps } from 'antd';
import {
  SearchOutlined,
  CloseOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  IdcardOutlined,
  RocketOutlined,
  CrownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { EntityType, type EntityReference, type EntitySearchFunction, type EntityTypeValue } from '@/types/entity.lookup.types';
import '@/css/EntityLookup.css';
import CustomPagination from '@/components/CustomPagination';


const { Text } = Typography;



// Component props
export interface EntityLookupProps {
  // Değer yönetimi - EntityReference kullanır
  value?: EntityReference | EntityReference[] | null;
  onChange?: (value: EntityReference | EntityReference[] | null) => void;
  // Arama fonksiyonu
  onSearch: EntitySearchFunction;
  
  // Ayarlar
  entityTypes: EntityTypeValue[];
  multiple?: boolean;
  disabled?: boolean;
  maxSelections?: number;

  // Stil
  style?: React.CSSProperties;
  className?: string;

  // Modal başlığı
  modalTitle?: string;
}

// ============================================
// CONSTANTS
// ============================================

// Entity tip konfigürasyonları
export const EntityTypeConfig: Record<
    EntityTypeValue,
      { label: string; icon: React.ReactNode; color: string }
> = {
  [EntityType.User]: {
    label: 'Kullanıcı',
    icon: <UserOutlined />,
    color: '#1890ff',
  },
  [EntityType.Account]: {
    label: 'Firma',
    icon: <BankOutlined />,
    color: '#52c41a',
  },
  [EntityType.Contact]: {
    label: 'Kişi',
    icon: <IdcardOutlined />,
    color: '#722ed1',
  },
  [EntityType.Lead]: {
    label: 'Aday Müşteri',
    icon: <RocketOutlined />,
    color: '#fa8c16',
  },
  [EntityType.Opportunity]: {
    label: 'Fırsat',
    icon: <CrownOutlined />,
    color: '#eb2f96',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const getEntityIcon = (entityType: EntityTypeValue): React.ReactNode => {
  return EntityTypeConfig[entityType]?.icon || <TeamOutlined />;
};

const getEntityColor = (entityType: EntityTypeValue): string => {
  return EntityTypeConfig[entityType]?.color || '#8c8c8c';
};

const getEntityLabel = (entityType: EntityTypeValue ): string => {
  return EntityTypeConfig[entityType]?.label || entityType;
};



// ============================================
// SELECTED ENTITY TAG COMPONENT
// ============================================

interface SelectedEntityTagProps {
  entity: EntityReference;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const SelectedEntityTag: React.FC<SelectedEntityTagProps> = ({
  entity,
  onRemove,
  disabled,
}) => {
  const color = getEntityColor(entity.entityType);
  const icon = getEntityIcon(entity.entityType);

  return (
    <div
      className="entity-lookup-tag"
      style={{
        borderColor: color,
        backgroundColor: `${color}10`,
      }}
    >
      <span className="entity-lookup-tag-icon" style={{ color }}>
        {icon}
      </span>
      <span className="entity-lookup-tag-name">{entity.name}</span>
      {!disabled && (
        <button
          type="button"
          className="entity-lookup-tag-close"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(entity.id);
          }}
          aria-label={`${entity.name} kaldır`}
        >
          <CloseOutlined />
        </button>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const EntityLookup: React.FC<EntityLookupProps> = ({
  value,
  onChange,
  onSearch,
  entityTypes,
  multiple = false,
  disabled = false,
  maxSelections,
  style,
  className,
  modalTitle = 'Kayıt seçin...',
}) => {
  


  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState<EntityTypeValue>(entityTypes[0]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchResults, setSearchResults] = useState<EntityReference[]>([]);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);


  // Refs
  const searchInputRef = useRef<any>(null);

  // Normalize value to array
  const selectedEntities = useMemo((): EntityReference[] => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Check if max selections reached
  const isMaxReached = useMemo(() => {
    if (!maxSelections || !multiple) return false;
    return selectedEntities.length >= maxSelections;
  }, [maxSelections, multiple, selectedEntities]);

  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
    setSearchHasMore(false);
    setSearchLoading(false);
  }, []);

  // Handle modal open
  const handleOpenModal = useCallback(() => {
    if (disabled) return;
    setModalVisible(true);
    setSearchText('');
    clearSearchResults();
    setPage(1);
    setSelectedEntityType(entityTypes[0]);
  }, [disabled, entityTypes, clearSearchResults]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSearchText('');
    clearSearchResults();
  }, [clearSearchResults]);

  // Focus search input when modal opens
  useEffect(() => {
    if (modalVisible && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [modalVisible]);

  // Perform search - parametreleri dışarıdan alır (stale closure önlemi)
  const performSearch = useCallback(
    async (
      entityType: EntityTypeValue,
      text: string,
      currentPage: number,
      currentPageSize: number
    ) => {
      //if (!text.trim()) {
      //  clearSearchResults();
      //  return;
      //}

      setSearchLoading(true);

      try {
        const response = await onSearch(entityType, text.trim(), currentPage, currentPageSize);

        setSearchResults(response.data);
        setSearchHasMore(response.hasMore);
      } finally {
        setSearchLoading(false);
      }
    },
    [onSearch, clearSearchResults]
  );

  // Handle search
  const handleSearch = useCallback(() => {
    setPage(1);
    performSearch(selectedEntityType, searchText, 1, pageSize);
  }, [selectedEntityType, searchText, pageSize, performSearch]);

  // Handle search input key press
  const handleSearchKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Handle entity type change
  const handleEntityTypeChange = useCallback(
    (newType: EntityTypeValue) => {
      setSelectedEntityType(newType);
      setPage(1);
      if (searchText.trim()) {
        performSearch(newType, searchText, 1, pageSize);
      }
    },
    [searchText, pageSize, performSearch]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      performSearch(selectedEntityType, searchText, newPage, pageSize);
    },
    [selectedEntityType, searchText, pageSize, performSearch]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1);
      performSearch(selectedEntityType, searchText, 1, newPageSize);
    },
    [selectedEntityType, searchText, performSearch]
  );

  // Handle record select
  const handleSelectRecord = useCallback(
    (record: EntityReference) => {

      if (multiple) {
        // Check if already selected
        const isAlreadySelected = selectedEntities.some((e) => e.id === record.id);
        if (isAlreadySelected) {
          // Remove if already selected
          const newValue = selectedEntities.filter((e) => e.id !== record.id);
          onChange?.(newValue.length > 0 ? newValue : null);
        } else if (!isMaxReached) {
          // Add to selections
          const newValue = [...selectedEntities, record];
          onChange?.(newValue);
        }
      } else {
        // Single select - replace and close
        onChange?.(record);
        handleCloseModal();
      }
    },
    [multiple, selectedEntities, isMaxReached, onChange, handleCloseModal]
  );

  // Handle remove entity
  const handleRemoveEntity = useCallback(
    (id: string) => {
      if (multiple) {
        const newValue = selectedEntities.filter((e) => e.id !== id);
        onChange?.(newValue.length > 0 ? newValue : null);
      } else {
        onChange?.(null);
      }
    },
    [multiple, selectedEntities, onChange]
  );

  // Handle row double click (for quick select)
  const handleRowDoubleClick = useCallback(
    (record: EntityReference) => {
      //if (!multiple) {
        handleSelectRecord(record);
      //}
    },
    [multiple, handleSelectRecord]
  );

  // Table columns
  const columns: TableProps<EntityReference>['columns'] = [
    {
      title: 'Tip',
      dataIndex: 'entityType',
      key: 'entityType',
      width: 60,
      align: 'center',
      render: (type: EntityTypeValue) => (
        <Tooltip title={getEntityLabel(type)}>
          <Avatar
            size="small"
            style={{ backgroundColor: getEntityColor(type) }}
            icon={getEntityIcon(type)}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Adı /Firma Adı',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: EntityReference) => {
        const isSelected = selectedEntities.some((e) => e.id === record.id);
        return (
          <Space orientation="vertical" size={0}>
            <Text strong style={{ color: isSelected ? '#1890ff' : undefined }}>
              {name}
              {isSelected && (
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  Seçili
                </Tag>
              )}
            </Text>
            {record.email && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.email}
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_: unknown, record: EntityReference) => {
        const isSelected = selectedEntities.some((e) => e.id === record.id);

        if (multiple) {
          return (
            <Button
              type={isSelected ? 'default' : 'primary'}
              size="small"
              onClick={() => handleSelectRecord(record)}
              disabled={!isSelected && isMaxReached}
            >
              {isSelected ? 'Kaldır' : 'Ekle'}
            </Button>
          );
        }

        return (
          <Button type="primary" size="small" onClick={() => handleSelectRecord(record)}>
            Seç
          </Button>
        );
      },
    },
  ];

  // Entity type options for dropdown
  const entityTypeOptions = useMemo(
    () =>
      entityTypes.map((type) => ({
        label: (
          <Space>
            {getEntityIcon(type)}
            <span>{getEntityLabel(type)}</span>
          </Space>
        ),
        value: type,
      })),
    [entityTypes]
  );

  return (
    <>
      {/* Input Field */}
      <div
        className={`entity-lookup-input ${disabled ? 'disabled' : ''} ${className || ''}`}
        style={style}
        onClick={handleOpenModal}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleOpenModal();
          }
        }}
      >
        {selectedEntities.length > 0 ? (
          <div className="entity-lookup-tags">
            {selectedEntities.map((entity) => (
              <SelectedEntityTag
                key={entity.id}
                entity={entity}
                onRemove={handleRemoveEntity}
                disabled={disabled}
              />
            ))}
          </div>
        ) : (
          <span className="entity-lookup-placeholder">{modalTitle}</span>
        )}
        <SearchOutlined className="entity-lookup-search-icon" />
      </div>

      {/* Lookup Modal */}
      <Modal
        title={
          <Space>
            <SearchOutlined />
            <span>{modalTitle}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        width={700}
        footer={
          multiple ? (
            <Space>
              <Text type="secondary">
                {selectedEntities.length} kayıt seçildi
                {maxSelections && ` (max: ${maxSelections})`}
              </Text>
              <Button onClick={handleCloseModal}>Kapat</Button>
              <Button type="primary" onClick={handleCloseModal}>
                Tamam
              </Button>
            </Space>
          ) : null
        }
        destroyOnHidden
        className="entity-lookup-modal"
      >
      
        {/* Search Bar */}
      {modalVisible && (
         <>
        <div className="entity-lookup-search-bar">
          {entityTypes.length > 1 && (
            <Select
              value={selectedEntityType}
              onChange={handleEntityTypeChange}
              options={entityTypeOptions}
              style={{ width: 160 }}
              className="entity-lookup-type-select"
            />
          )}
          <Input
            ref={searchInputRef}
            placeholder="Arama yapın..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            style={{ flex: 1 }}
            allowClear
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={searchLoading}>
            Ara
          </Button>
        </div>

        {/* Selected Items Preview (for multiple) */}
        {multiple && selectedEntities.length > 0 && (
          <div className="entity-lookup-selected-preview">
            <Text type="secondary" style={{ marginRight: 8 }}>
              Seçilenler:
            </Text>
            <div className="entity-lookup-selected-tags">
              {selectedEntities.map((entity) => (
                <SelectedEntityTag
                  key={entity.id}
                  entity={entity}
                  onRemove={handleRemoveEntity}
                />
              ))}
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="entity-lookup-results">
          {searchLoading ? (
            <div className="entity-lookup-loading">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              <Text type="secondary">Aranıyor...</Text>
            </div>
          ) : searchResults.length > 0 ? (
            
          <Card styles={{ body: { padding: 0 } }}>
            <Table<EntityReference>
              rowKey="id"
              columns={columns}
              dataSource={searchResults as EntityReference[]}
              pagination={false}
              size="small"
              onRow={(record) => ({
                onDoubleClick: () => handleRowDoubleClick(record),
                style: {
                  cursor: 'pointer',
                  backgroundColor: selectedEntities.some((e) => e.id === record.id)
                    ? '#e6f7ff'
                    : undefined,
                },
              })}
              scroll={{ y: 300 }}
            />
            {/* Custom Pagination */}
            <CustomPagination
              current={page}
              pageSize={pageSize}
              hasMore={searchHasMore}
              totalItems={searchResults?.length || 0 }
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </Card>

          ) : searchText.trim() ? (
            <Empty
              description="Sonuç bulunamadı"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: '40px 0' }}
            />
          ) : (
            <Empty
              description="Aramak için bir metin girin"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: '40px 0' }}
            />
          )}
        </div>
        </>
      )}
      </Modal>
    </>
  );
};

export default EntityLookup;