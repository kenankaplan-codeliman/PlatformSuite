import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuIcons } from '@/config/entity.config';
import { RoutePaths } from '@/config/route.paths';


const { Sider, Content } = Layout;

export default function ContentLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = (location.pathname === "/") ? "/search" : location.pathname;

  return (
    <Layout style={{ minHeight: "100%" }}>
      {/* SIDEBAR */}
      <Sider
        theme="light"
        style={{
          borderRight: "1px solid #f0f0f0",
          background: "#fff"
        }}
        collapsible
        trigger={undefined}   
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: RoutePaths.DashboardPath,
              icon: MenuIcons.dashboard,
              label: "Dashboard"
            },
            {
              key: RoutePaths.Activity.List,
              icon: MenuIcons.activity,
              label: "Aktiviteler"
            },
            {
              key: RoutePaths.Lead.List,
              icon: MenuIcons.lead,
              label: "Lead"
            },
            {
              key: RoutePaths.Account.List,
              icon: MenuIcons.account,
              label: "Firmalar"
            },
            {
              key: RoutePaths.Contact.List,
              icon: MenuIcons.contact,
              label: "Kişiler"
            },
            {
              key: RoutePaths.Opportunity.List,
              icon: MenuIcons.opportunity,
              label: "Fırsatlar"
            },
            {
              key: RoutePaths.ReportsPath,
              icon: MenuIcons.reports,
              label: "Raporlar"
            },
            {
              key: RoutePaths.SettingsPath,
              icon: MenuIcons.settings,
              label: "Ayarlar"
            },
          ]}
        />
      </Sider>

      {/* CONTENT */}
      <Content
        style={{
          padding: 16,
          background: "#f5f5f5",
          minHeight: "100vh"
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}
