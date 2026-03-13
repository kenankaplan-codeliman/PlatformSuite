import { Popover, Avatar, Button, Divider } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthState } from '@/stores/auth.store';
import RoutePaths from "@/config/route.paths";

const UserPanel = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthState();

    const handleLogout = () => {
        navigate(RoutePaths.Login, { replace: true });
        logout();
    };

    if (!user) return <></>;

    const content = (
        <div style={{ minWidth: 180 }}>
            <p><b>{user.displayName}</b></p>
            <p>{user.email}</p>
            <Divider size="small" />
            <Button
                type="primary"
                danger
                block
                icon={<LogoutOutlined />}
                onClick={handleLogout}
            >
                Çıkış
            </Button>
        </div>
    );

    return (
        <Popover content={content} trigger="click" placement="bottomRight">
            <Avatar
                icon={<UserOutlined />}
                style={{ cursor: 'pointer', backgroundColor: '#001529' }}
            />
        </Popover>
    );
};

export default UserPanel;