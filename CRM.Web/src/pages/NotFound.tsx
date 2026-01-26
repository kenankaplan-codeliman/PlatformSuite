import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Aradığınız sayfa bulunamadı."
        extra={[
          <Button
            type="primary"
            key="home"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            Ana Sayfa
          </Button>,
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Geri Dön
          </Button>,
        ]}
      />
    </div>
  );
};

export default NotFound;
