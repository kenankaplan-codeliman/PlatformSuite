import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Card, Divider } from "antd";
import { useAuthState } from "@/stores/auth.store";
import { loginRequest, msalInstance } from "@/util/msalInstance";
import MicrosoftOutlined from '@/components/MicrosoftIcon';
import { useEffect } from "react";
import RoutePaths from "@/constants/route.paths";
import { StateType, useProcessState } from "@/stores/process.state.store";

const Login = () => {

  const { login, loginWithMicrosoft } = useAuthState();
  const navigate = useNavigate();
  const { state } = useProcessState();
  


useEffect(() => {
    if (state === StateType.Success) { 
      setTimeout(() => {
        navigate(RoutePaths.DashboardPath, { replace: true });
      }, 1000);
    }
  }, [state]);


  // ========================================
  // MICROSOFT 365 LOGIN
  // ========================================
  const handleMicrosoftLogin = async () => {

      const loginResponse = await msalInstance.loginPopup(loginRequest);

      console.log('Microsoft login successful:', loginResponse.account.username);

      msalInstance.setActiveAccount(loginResponse.account);

      const msTokenResponse = await msalInstance.acquireTokenSilent({
        account: loginResponse.account,
        scopes: ['User.Read', 'openid', 'profile', 'email'],
      });

      loginWithMicrosoft(msTokenResponse.accessToken);

  };

  // ========================================
  // EMAIL/PASSWORD LOGIN
  // ========================================

  const handleLogin = async (values: {
    email: string;
    password: string;
  }) => {

      await login(values.email, values.password);

  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Card
        title="Login"
        style={{ width: 380, }}
        styles={{
          header: {
            backgroundColor: "#001529",
          },
          title: {
            color: "white",
            fontSize: 18,
            fontWeight: 600,
            textAlign: "center",
          },
        }}
      >
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>

        </Form>
        <Divider size="small" />
        <Button type="primary" htmlType="submit" icon={<MicrosoftOutlined />} block onClick={handleMicrosoftLogin}>
          Login with Microsoft 365
        </Button>
      </Card>
    </div>
  );
}

export default Login;