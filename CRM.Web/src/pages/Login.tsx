import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Card, Divider } from "antd";
import { useAuthState } from "@/stores/auth.store";
import { loginRequest, msalInstance } from "@/util/msalInstance";
import MicrosoftOutlined from '@/components/MicrosoftIcon';
import RoutePaths from "@/config/route.paths";

const Login = () => {

  const { login, loginWithMicrosoft } = useAuthState();
  const navigate = useNavigate();
 
  // ── Microsoft 365 Login ──────────────────────────────────────────────────
  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      msalInstance.setActiveAccount(loginResponse.account);
      
      const msTokenResponse = await msalInstance.acquireTokenSilent({
        account: loginResponse.account,
        scopes: ['User.Read', 'openid', 'profile', 'email'],
      });

      await loginWithMicrosoft(msTokenResponse.accessToken);
      navigate(RoutePaths.DashboardPath, { replace: true });
    } catch (error) {
      console.error('Microsoft Login failed:', error);
    }
  };
 
  // ── Email/Password Login ─────────────────────────────────────────────────
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      navigate(RoutePaths.DashboardPath, { replace: true });
    } catch (error) {
      console.error('Email Login failed:', error);
    }
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
        <Button type="primary" icon={<MicrosoftOutlined />} block onClick={handleMicrosoftLogin}>
          Login with Microsoft 365
        </Button>
      </Card>
    </div>
  );
}

export default Login;