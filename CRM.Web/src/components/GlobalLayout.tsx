import { useEffect } from "react";
import { Layout, Typography } from "antd";
import { Outlet } from "react-router-dom";
import UserPanel from "./UserPanel";
import { useLoadingModal } from '@/components/LoadingModal';
import { StateType, useProcessState } from "@/stores/process.state.store";


const { Header, Content } = Layout;
const { Text } = Typography;

const GlobalLayout = () => {

  const { state, title, message } = useProcessState();

  const {
    showLoading,
    showSuccess,
    showError,
    closeLoading,
  } = useLoadingModal();

  useEffect(() => {
    if (state === StateType.Loading) {
      showLoading(
        title || 'Loading',
        message || 'Please wait...',
      );

    } else if (state === StateType.Success) {
      showSuccess(
        title || 'Success',
        message || 'Operation completed successfully.',
      );

    } else if (state === StateType.Error) {
      showError(
        title || 'Error',
        message || 'An error occurred.'
      );
    }
    else {
      closeLoading();
    }
  }, [state]);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
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
          minHeight: 0,        // "calc(100vh - 150px)" kaldır
          overflow: "hidden",
          display: "flex",
        }}
      >
        <Outlet />
      </Content>

    </Layout>
  );
}

export default GlobalLayout;