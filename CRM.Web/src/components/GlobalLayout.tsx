import { Layout, Typography } from "antd";
import { Outlet } from "react-router-dom";
import UserPanel from "./UserPanel";

const { Header, Content } = Layout;
const { Text } = Typography;

const GlobalLayout = () => {

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header

                style={{
                    background: "#001529",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingInline: 24
                }}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
                    CRM
                </Text>

                <UserPanel />
            </Header>

            <Content
                style={{
                    padding: 0,
                    flex: 1,
                    display: "flex"
                }}
            >
                <Outlet />
            </Content>

        </Layout>
    );
}

export default GlobalLayout;