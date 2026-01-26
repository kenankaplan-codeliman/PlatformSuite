import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Card, Divider } from "antd";
import { authService } from "@/services/auth.sevice";
import { useAuthState } from "@/stores/auth.store";
import { useHandleError } from '@/util/useHandleError';
import { useLoadingModal } from '@/components/LoadingModal';
import { loginRequest, msalInstance } from "@/util/msalInstance";
import MicrosoftOutlined from '@/components/MicrosoftIcon';

const Login = () => {

  const { login } = useAuthState();
  const navigate = useNavigate();
  const { handleError } = useHandleError();
  
  const {
    showLoading,
    showSuccess,
    showError,
    closeLoading,
    showStep
  } = useLoadingModal();


  // ========================================
  // MICROSOFT 365 LOGIN
  // ========================================
  const handleMicrosoftLogin = async () => {
    try {

      // 2. Show loading modal
      showLoading({
        title: 'Authenticating with Microsoft',
        description: 'Please complete the login in the popup window...',
      });

      // 3. Microsoft login
      const loginResponse = await msalInstance.loginPopup(loginRequest);

      console.log('Microsoft login successful:', loginResponse.account.username);

      msalInstance.setActiveAccount(loginResponse.account);

      // 4. Update modal - backend step
      showStep(
        'processing',
        'Validating with Backend',
        'Creating your session...'
      );

      // 5. Ms Token acquire
      const msTokenResponse = await msalInstance.acquireTokenSilent({
        account: loginResponse.account,
        scopes: ['User.Read', 'openid', 'profile', 'email'],
      });

      // 6. Api loging
      const apiResponse = await authService.microsoftCallback(
        msTokenResponse.accessToken
      );

      // 7. Store'a kaydet
      login(
        apiResponse.user,
        apiResponse.accessToken,
        apiResponse.accessTokenExpireAt,
        apiResponse.refreshToken,
      );

      // 6. Success modal
      showSuccess('Login Successful', 'You have been logged in successfully.');

      setTimeout(() => {
        closeLoading();
        navigate('/', { replace: true });
      }, 1000);

    } catch (error: any) {
      showError('Microsoft Login Error', handleError(error, { showMessage: false }));
      setTimeout(() => {
        closeLoading();
      }, 3000);
    }
  };

  // ========================================
  // EMAIL/PASSWORD LOGIN
  // ========================================

  const handleLogin = async (values: {
    email: string;
    password: string;
  }) => {

    try {

      // 1. Show Loading
      showLoading({
        title: 'Authenticating...',
        description: 'Please wait...',
      });
      
      // 2. Api login
      const apiResponse = await authService.login(
        values.email,
        values.password
      );

      // 3. Store'a kaydet
      login(
        apiResponse.user,
        apiResponse.accessToken,
        apiResponse.accessTokenExpireAt,
        apiResponse.refreshToken,
      );

      showSuccess('Login Successful', 'You have been logged in successfully.');
      setTimeout(() => {
        closeLoading();
        navigate('/', { replace: true });
      }, 1000);

    } catch (error) {
      showError('Login Error', handleError(error, { showMessage: false }));
      setTimeout(() => {
        closeLoading();
      }, 3000);
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
        <Button type="primary" htmlType="submit" icon={<MicrosoftOutlined />} block onClick={handleMicrosoftLogin}>
          Login with Microsoft 365
        </Button>
      </Card>
    </div>
  );
}

export default Login;