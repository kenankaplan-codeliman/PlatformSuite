import { useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Space, Result } from 'antd';
import { ArrowLeftOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PhoneCallDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view';
  const isNew = !id || id === 'new';

  const handleBack = useCallback(() => {
    navigate('/activity?view=list');
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Space align="center">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
          <Title level={4} style={{ margin: 0 }}>
            {isNew ? 'Yeni Telefon Görüşmesi' : mode === 'edit' ? 'Telefon Görüşmesi Düzenle' : 'Telefon Görüşmesi Detayı'}
          </Title>
        </Space>
      </Card>

      <Card>
        <Result
          icon={<PhoneOutlined style={{ color: '#52c41a' }} />}
          title="Telefon Görüşmesi Detay Sayfası"
          subTitle={
            isNew
              ? 'Bu sayfa yeni telefon görüşmesi oluşturmak için kullanılacaktır.'
              : `Telefon Görüşmesi ID: ${id} - Mode: ${mode}`
          }
          extra={
            <Space>
              <Button onClick={handleBack}>Listeye Dön</Button>
              <Button type="primary" disabled>
                Bu sayfa henüz geliştirilmedi
              </Button>
            </Space>
          }
        />
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">
            Telefon görüşmesi aktivitesi için detay sayfası burada oluşturulacaktır.
            <br />
            Caller, Recipient, Call Direction, Duration, Call Notes gibi alanlar eklenecektir.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default PhoneCallDetail;
