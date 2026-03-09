import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Flex,
  Skeleton,
  Alert,
  List,
  Avatar,
  Tag,
  Empty,
} from 'antd';
import {
  UserOutlined,
  BankOutlined,
  DollarOutlined,
  CrownOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  RocketOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useAuthState } from '@/stores/auth.store';
import dashboardService from '@/services/dashboard.service';
import type {
  DashboardLeadStats,
  DashboardAccountStats,
  DashboardOpportunityStats,
  DashboardRevenueStats,
} from '@/types/dashboard.types';
import type { LeadListItem } from '@/types/lead.types';
import {
  getLeadStatusLabel,
  getLeadStatusColor,
  getLeadRatingLabel,
  getLeadRatingColor,
} from '@/types/lead.types';
import type { ActivityListItem } from '@/types/activity.types';
import {
  getActivityTypeLabel,
  getActivityTypeColor,
  getActivityTypeIcon,
  getActivityStatusLabel,
  getActivityStatusColor,
} from '@/types/activity.types';
import { formatCurrency } from '@/types/opportunity.types';

const { Title, Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type AsyncPanel<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// ─── Yardımcı ─────────────────────────────────────────────────────────────────

function initPanel<T>(): AsyncPanel<T> {
  return { data: null, loading: true, error: null };
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title, icon, iconColor, loading, error, onRetry, children,
}) => (
  <Card styles={{ body: { padding: '20px 24px' } }}>
    <Flex justify="space-between" align="flex-start">
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>{title}</Text>
        <div style={{ marginTop: 6, minHeight: 52 }}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} title={false} />
          ) : error ? (
            <Flex align="center" gap={6}>
              <Text type="danger" style={{ fontSize: 12 }}>Yüklenemedi</Text>
              <ReloadOutlined
                style={{ color: '#1890ff', cursor: 'pointer', fontSize: 12 }}
                onClick={onRetry}
              />
            </Flex>
          ) : children}
        </div>
      </div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${iconColor}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color: iconColor, flexShrink: 0, marginLeft: 12,
      }}>
        {icon}
      </div>
    </Flex>
  </Card>
);

// ─── ChangeText ───────────────────────────────────────────────────────────────

const ChangeText: React.FC<{ value: number }> = ({ value }) => {
  const positive = value >= 0;
  return (
    <Flex align="center" gap={4} style={{ marginTop: 4 }}>
      {positive
        ? <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 11 }} />
        : <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 11 }} />}
      <Text style={{ fontSize: 12, color: positive ? '#52c41a' : '#ff4d4f' }}>
        %{Math.abs(value)} geçen aya göre
      </Text>
    </Flex>
  );
};

// ─── ListPanel ────────────────────────────────────────────────────────────────

interface ListPanelProps {
  title: React.ReactNode;
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyText: string;
  onRetry: () => void;
  children: React.ReactNode;
}

const ListPanel: React.FC<ListPanelProps> = ({
  title, loading, error, empty, emptyText, onRetry, children,
}) => (
  <Card
    title={title}
    extra={error
      ? <ReloadOutlined style={{ color: '#1890ff', cursor: 'pointer' }} onClick={onRetry} />
      : undefined}
    styles={{ body: { padding: '0 0 4px' } }}
  >
    {loading ? (
      <div style={{ padding: '16px 24px' }}>
        <Skeleton active paragraph={{ rows: 4 }} title={false} />
      </div>
    ) : error ? (
      <div style={{ padding: 16 }}>
        <Alert type="error" title="Veriler yüklenemedi" showIcon />
      </div>
    ) : empty ? (
      <Empty
        description={emptyText}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ padding: '24px 0' }}
      />
    ) : children}
  </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const { user } = useAuthState();

  const [leadStats, setLeadStats] = useState<AsyncPanel<DashboardLeadStats>>(initPanel());
  const [accountStats, setAccountStats] = useState<AsyncPanel<DashboardAccountStats>>(initPanel());
  const [opportunityStats, setOpportunityStats] = useState<AsyncPanel<DashboardOpportunityStats>>(initPanel());
  const [revenueStats, setRevenueStats] = useState<AsyncPanel<DashboardRevenueStats>>(initPanel());
  const [recentLeads, setRecentLeads] = useState<AsyncPanel<LeadListItem[]>>(initPanel());
  const [upcomingActivities, setUpcomingActivities] = useState<AsyncPanel<ActivityListItem[]>>(initPanel());

  // ── Fetch fonksiyonları ─────────────────────────────────────────────────────

  const fetchLeadStats = useCallback(async () => {
    setLeadStats((p) => ({ ...p, loading: true, error: null }));
    try {
      setLeadStats({ data: await dashboardService.getLeadStats(), loading: false, error: null });
    } catch {
      setLeadStats((p) => ({ ...p, loading: false, error: 'Hata' }));
    }
  }, []);

  const fetchAccountStats = useCallback(async () => {
    setAccountStats((p) => ({ ...p, loading: true, error: null }));
    try {
      setAccountStats({ data: await dashboardService.getAccountStats(), loading: false, error: null });
    } catch {
      setAccountStats((p) => ({ ...p, loading: false, error: 'Hata' }));
    }
  }, []);

  const fetchOpportunityStats = useCallback(async () => {
    setOpportunityStats((p) => ({ ...p, loading: true, error: null }));
    try {
      setOpportunityStats({ data: await dashboardService.getOpportunityStats(), loading: false, error: null });
    } catch {
      setOpportunityStats((p) => ({ ...p, loading: false, error: 'Hata' }));
    }
  }, []);

  const fetchRevenueStats = useCallback(async () => {
    setRevenueStats((p) => ({ ...p, loading: true, error: null }));
    try {
      setRevenueStats({ data: await dashboardService.getRevenueStats(), loading: false, error: null });
    } catch {
      setRevenueStats((p) => ({ ...p, loading: false, error: 'Hata' }));
    }
  }, []);

  const fetchRecentLeads = useCallback(async () => {
    setRecentLeads((p) => ({ ...p, loading: true, error: null }));
    try {
      setRecentLeads({ data: await dashboardService.getRecentLeads(), loading: false, error: null });
    } catch {
      setRecentLeads((p) => ({ ...p, loading: false, error: 'Hata' }));
    }
  }, []);

  const fetchUpcomingActivities = useCallback(async () => {
    setUpcomingActivities((p) => ({ ...p, loading: true, error: null }));
    try {
      setUpcomingActivities({ data: await dashboardService.getUpcomingActivities(), loading: false, error: null });
    } catch {
      setUpcomingActivities((p) => ({ ...p, loading: false, error: 'Hata' }));
    }
  }, []);

  useEffect(() => {
    fetchLeadStats();
    fetchAccountStats();
    fetchOpportunityStats();
    fetchRevenueStats();
    fetchRecentLeads();
    fetchUpcomingActivities();
  }, [
    fetchLeadStats, fetchAccountStats, fetchOpportunityStats, fetchRevenueStats,
    fetchRecentLeads, fetchUpcomingActivities,
  ]);

  const opp = opportunityStats.data;
  const currency = revenueStats.data?.currency ?? 'TRY';

  return (
    <div style={{ padding: 24 }}>
      {/* ── Karşılama ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          Hoş geldiniz{user?.displayName ? `, ${user.displayName}` : ''}! 👋
        </Title>
        <Text type="secondary">İşte bugünkü iş durumunun özeti.</Text>
      </div>

      {/* ── Satır 1: Lead, Firma, Açık Fırsat, Ciro ───────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Toplam Aday Müşteri" icon={<UserOutlined />} iconColor="#1890ff"
            loading={leadStats.loading} error={leadStats.error} onRetry={fetchLeadStats}
          >
            <Text strong style={{ fontSize: 26 }}>{leadStats.data?.total}</Text>
            {leadStats.data && <ChangeText value={leadStats.data.changePercent} />}
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Aktif Firma" icon={<BankOutlined />} iconColor="#52c41a"
            loading={accountStats.loading} error={accountStats.error} onRetry={fetchAccountStats}
          >
            <Text strong style={{ fontSize: 26 }}>{accountStats.data?.activeCount}</Text>
            {accountStats.data && <ChangeText value={accountStats.data.changePercent} />}
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Açık Fırsat" icon={<CrownOutlined />} iconColor="#eb2f96"
            loading={opportunityStats.loading} error={opportunityStats.error} onRetry={fetchOpportunityStats}
          >
            <Text strong style={{ fontSize: 26 }}>{opp?.activeCount}</Text>
            {opp && <ChangeText value={opp.changePercent} />}
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Aylık Ciro (MTD)" icon={<DollarOutlined />} iconColor="#52c41a"
            loading={revenueStats.loading} error={revenueStats.error} onRetry={fetchRevenueStats}
          >
            <Text strong style={{ fontSize: 20, color: '#52c41a' }}>
              {revenueStats.data
                ? formatCurrency(revenueStats.data.mtd, revenueStats.data.currency)
                : '—'}
            </Text>
            {revenueStats.data && <ChangeText value={revenueStats.data.changePercent} />}
          </StatCard>
        </Col>
      </Row>

      {/* ── Satır 2: Fırsat detay kartları ────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Toplam Fırsat" icon={<RiseOutlined />} iconColor="#1890ff"
            loading={opportunityStats.loading} error={opportunityStats.error} onRetry={fetchOpportunityStats}
          >
            <Text strong style={{ fontSize: 26 }}>{opp?.total}</Text>
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Toplam Tahmini Değer" icon={<DollarOutlined />} iconColor="#13c2c2"
            loading={opportunityStats.loading} error={opportunityStats.error} onRetry={fetchOpportunityStats}
          >
            <Text strong style={{ fontSize: 18, color: '#13c2c2' }}>
              {opp ? formatCurrency(opp.totalEstimatedValue, currency) : '—'}
            </Text>
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Kazanılan Değer" icon={<TrophyOutlined />} iconColor="#faad14"
            loading={opportunityStats.loading} error={opportunityStats.error} onRetry={fetchOpportunityStats}
          >
            <Text strong style={{ fontSize: 18, color: '#faad14' }}>
              {opp ? formatCurrency(opp.wonValue, currency) : '—'}
            </Text>
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Aktif Fırsat" icon={<ThunderboltOutlined />} iconColor="#722ed1"
            loading={opportunityStats.loading} error={opportunityStats.error} onRetry={fetchOpportunityStats}
          >
            <Text strong style={{ fontSize: 26, color: '#722ed1' }}>{opp?.activeCount}</Text>
          </StatCard>
        </Col>
      </Row>

      {/* ── Satır 3: Son Aday Müşteriler & Yaklaşan Aktiviteler ───────────── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ListPanel
            title={<Space><RocketOutlined style={{ color: '#fa8c16' }} /><span>Son Aday Müşteriler</span></Space>}
            loading={recentLeads.loading}
            error={recentLeads.error}
            empty={!recentLeads.data?.length}
            emptyText="Kayıt bulunamadı"
            onRetry={fetchRecentLeads}
          >
            <List
              dataSource={recentLeads.data ?? []}
              renderItem={(lead: LeadListItem) => (
                <List.Item style={{ padding: '10px 24px' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={34}
                        icon={<UserOutlined />}
                        style={{ background: '#fa8c1618', color: '#fa8c16' }}
                      />
                    }
                    title={
                      <Flex align="center" gap={6} wrap="wrap">
                        <Text strong style={{ fontSize: 13 }}>
                          {lead.firstName} {lead.lastName}
                        </Text>
                        <Tag color={getLeadStatusColor(lead.leadStatus)} style={{ fontSize: 11, margin: 0 }}>
                          {getLeadStatusLabel(lead.leadStatus)}
                        </Tag>
                        <Tag color={getLeadRatingColor(lead.leadRating)} style={{ fontSize: 11, margin: 0 }}>
                          {getLeadRatingLabel(lead.leadRating)}
                        </Tag>
                      </Flex>
                    }
                    description={
                      lead.companyName ? (
                        <Flex align="center" gap={4}>
                          <BankOutlined style={{ fontSize: 11, color: '#8c8c8c' }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>{lead.companyName}</Text>
                        </Flex>
                      ) : undefined
                    }
                  />
                </List.Item>
              )}
            />
          </ListPanel>
        </Col>

        <Col xs={24} lg={12}>
          <ListPanel
            title={<Space><ScheduleOutlined style={{ color: '#722ed1' }} /><span>Yaklaşan Aktiviteler</span></Space>}
            loading={upcomingActivities.loading}
            error={upcomingActivities.error}
            empty={!upcomingActivities.data?.length}
            emptyText="Yaklaşan aktivite yok"
            onRetry={fetchUpcomingActivities}
          >
            <List
              dataSource={upcomingActivities.data ?? []}
              renderItem={(activity: ActivityListItem) => {
                const typeColor = getActivityTypeColor(activity.activityType);
                const typeIcon  = getActivityTypeIcon(activity.activityType);
                const dueDate   = activity.dueDate ? new Date(activity.dueDate) : null;
                const isOverdue = dueDate ? dueDate < new Date() : false;

                return (
                  <List.Item style={{ padding: '10px 24px' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={34}
                          icon={typeIcon}
                          style={{ background: `${typeColor}18`, color: typeColor }}
                        />
                      }
                      title={
                        <Flex align="center" gap={6} wrap="wrap">
                          <Text strong style={{ fontSize: 13 }}>{activity.subject}</Text>
                          <Tag
                            color={typeColor}
                            style={{ fontSize: 11, margin: 0, border: 'none' }}
                          >
                            {getActivityTypeLabel(activity.activityType)}
                          </Tag>
                          <Tag
                            color={getActivityStatusColor(activity.status)}
                            style={{ fontSize: 11, margin: 0 }}
                          >
                            {getActivityStatusLabel(activity.status)}
                          </Tag>
                        </Flex>
                      }
                      description={
                        dueDate ? (
                          <Text style={{ fontSize: 12, color: isOverdue ? '#ff4d4f' : '#8c8c8c' }}>
                            {dueDate.toLocaleDateString('tr-TR', {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </Text>
                        ) : undefined
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </ListPanel>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;