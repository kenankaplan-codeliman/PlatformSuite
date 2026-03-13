import React from 'react';
import { Card, Descriptions, Space, Tag, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { formatDate } from '@/util/dateHelper';
import { getEntityColor, getEntityIcon } from '@/config/entity.config';
import type { AuditInfo } from '@/types/common.types';

const { Text } = Typography;

const renderDate = (date?: Date | string | null): React.ReactNode =>
  formatDate(date) ?? <Text type="secondary">-</Text>;

interface AuditCardProps {
  audit?: AuditInfo;
  style?: React.CSSProperties;
}

const AuditCard: React.FC<AuditCardProps> = ({ audit, style }) => (
  <Card
    title={<Space><ClockCircleOutlined /><span>Kayıt Bilgileri</span></Space>}
    style={style}
  >
    <Descriptions column={1} size="small">
      <Descriptions.Item label="Sorumlu">
        {audit?.owner
          ? <Tag icon={getEntityIcon(audit.owner.entityType)} color={getEntityColor(audit.owner.entityType)}>{audit.owner.name}</Tag>
          : <Text type="secondary">-</Text>}
      </Descriptions.Item>
      <Descriptions.Item label="Oluşturan">
        {audit?.createdBy
          ? <Tag icon={getEntityIcon(audit.createdBy.entityType)} color={getEntityColor(audit.createdBy.entityType)}>{audit.createdBy.name}</Tag>
          : <Text type="secondary">-</Text>}
      </Descriptions.Item>
      <Descriptions.Item label="Oluşturulma">
        {renderDate(audit?.createdAt)}
      </Descriptions.Item>
      <Descriptions.Item label="Güncelleyen">
        {audit?.updatedBy
          ? <Tag icon={getEntityIcon(audit.updatedBy.entityType)} color={getEntityColor(audit.updatedBy.entityType)}>{audit.updatedBy.name}</Tag>
          : <Text type="secondary">-</Text>}
      </Descriptions.Item>
      <Descriptions.Item label="Son Güncelleme">
        {renderDate(audit?.updatedAt)}
      </Descriptions.Item>
    </Descriptions>
  </Card>
);

export default AuditCard;