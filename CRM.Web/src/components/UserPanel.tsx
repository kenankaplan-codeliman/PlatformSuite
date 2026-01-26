import { Popover, Avatar, Button, Divider } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { authService } from "@/services/auth.sevice";

import { useNavigate } from "react-router-dom";
import { useAuthState } from '@/stores/auth.store';
import { useHandleError } from '@/util/useHandleError';
import { useLoadingModal } from '@/components/LoadingModal';

const UserPanel = () => {

    const navigate = useNavigate();
    const { isAuthenticated, accessToken, user, logout } = useAuthState();
    const { handleError } = useHandleError();

    const {
        showLoading,
        showError,
        closeLoading,
    } = useLoadingModal();

    const handleLogout = () => {

        showLoading({
            title: 'Logging out',
            description: 'Please wait...',
        });

        if (accessToken) {

            authService.logout(accessToken)
                .then(() => {
                    setTimeout(() => {
                        closeLoading();
                        navigate('/', { replace: true });
                    }, 1000);
                })
                .catch((error) => {
                    showError('Logout Error', handleError(error, { showMessage: false }));
                    setTimeout(() => {
                        closeLoading();
                    }, 3000);
                });
        }
        else {
            closeLoading();
        }

        logout();

    };

    const content = (
        <div style={{ minWidth: 180 }}>
            <p><b>{user?.displayName}</b></p>
            <p>{user?.email}</p>
            <Divider size="small" />
            <Button type="primary" danger block icon={<LogoutOutlined />} onClick={handleLogout} >
                Çıkış
            </Button>
        </div>
    );

    if (isAuthenticated) {
        return (
            <Popover
                content={content}
                trigger="click"
                placement="bottomRight"
            >
                <Avatar
                    icon={<UserOutlined />}
                    style={{ cursor: "pointer" }}
                />
            </Popover>

        );
    } else {
        return <></>;
    }
};

export default UserPanel;
