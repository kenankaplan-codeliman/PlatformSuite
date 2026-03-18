import React from 'react';
import { Card, Descriptions, Space, Tag, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { formatDate } from '@/util/dateHelper';
import { getEntityColor, getEntityIcon } from '@/config/entity.config';
import type { AuditInfo } from '@/types/common.types';

const { Text } = Typography;

const renderDate = (date?: Date | string | null): React.ReactNode =>
  formatDate(date) ?? <Text type="secondary">-</Text>;

const renderUser = (entity?: AuditInfo['owner']): React.ReactNode =>
  entity
    ? <Tag icon={getEntityIcon(entity.entityType)} color={getEntityColor(entity.entityType)}>{entity.name}</Tag>
    : <Text type="secondary">-</Text>;

interface AuditCardProps {
  audit?: AuditInfo;
  /** 
   * "vertical"  → Descriptions column=1, dar kartlar için (varsayılan)
   * "horizontal" → Descriptions column=5, tam genişlik footer için
   */
  layout?: 'vertical' | 'horizontal';
  style?: React.CSSProperties;
}

const AuditCard: React.FC<AuditCardProps> = ({ audit, layout = 'vertical', style }) => {
  const column = layout === 'horizontal' ? 5 : 1;

  return (
    <Card
      title={<Space><ClockCircleOutlined /><span>Kayıt Bilgileri</span></Space>}
      style={style}
    >
      <Descriptions column={column} size="small">
        <Descriptions.Item label="Sorumlu">
          {renderUser(audit?.owner)}
        </Descriptions.Item>
        <Descriptions.Item label="Oluşturan">
          {renderUser(audit?.createdBy)}
        </Descriptions.Item>
        <Descriptions.Item label="Oluşturulma">
          {renderDate(audit?.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Güncelleyen">
          {renderUser(audit?.updatedBy)}
        </Descriptions.Item>
        <Descriptions.Item label="Son Güncelleme">
          {renderDate(audit?.updatedAt)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default AuditCard;