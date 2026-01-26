import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useAuthState } from '@/stores/auth.store';

const { Title, Text } = Typography;

/**
 * Dashboard Page
 * Shows overview statistics and recent activities
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuthState();

  return (
    <div>
      {/* Welcome Section */}
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            Welcome back, {user?.displayName}! 👋
          </Title>
          <Text type="secondary">
            Here's what's happening with your business today.
          </Text>
        </div> */}

        {/* Statistics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Leads"
                value={156}
                prefix={<UserOutlined />}
                styles={{
                  content: { color: '#3f8600' }
                }}
                suffix={<RiseOutlined />}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                +12% from last month
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Accounts"
                value={89}
                prefix={<ShopOutlined />}
                styles={{
                  content: { color: '#1890ff' }
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                +5% from last month
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Open Opportunities"
                value={42}
                prefix={<DollarOutlined />}
                styles={{
                  content: { color: '#faad14' }
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                $2.4M total value
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Revenue (MTD)"
                value={487500}
                prefix="$"
                precision={0}
                styles={{
                  content: { color: '#52c41a' }
                }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                +18% from last month
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Recent Activities */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Recent Leads" variant="borderless">
              <Text type="secondary">No recent leads to display</Text>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Upcoming Activities" variant="borderless">
              <Text type="secondary">No upcoming activities</Text>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default DashboardPage;
