import { Popover, Avatar, Button, Divider } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthState } from '@/stores/auth.store';
import RoutePaths from "@/constants/route.paths";
import { useEffect } from "react";

const UserPanel = () => {

    const navigate = useNavigate();
    const { isAuthenticated, accessToken, user, logout, loadUser } = useAuthState();

    useEffect(() => {
        if (isAuthenticated && !user){
            loadUser();
        }
    }, [isAuthenticated]);

    const handleLogout = async () => {

        if (accessToken) {
           await logout()
        }

        setTimeout(() => {
            navigate(RoutePaths.Login, { replace: true });
        }, 1000);
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
