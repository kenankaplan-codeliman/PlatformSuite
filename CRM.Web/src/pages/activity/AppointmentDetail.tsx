import { useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Space, Result } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AppointmentDetail: React.FC = () => {
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
            {isNew ? 'Yeni Randevu' : mode === 'edit' ? 'Randevu Düzenle' : 'Randevu Detayı'}
          </Title>
        </Space>
      </Card>

      <Card>
        <Result
          icon={<CalendarOutlined style={{ color: '#722ed1' }} />}
          title="Randevu Detay Sayfası"
          subTitle={
            isNew
              ? 'Bu sayfa yeni randevu oluşturmak için kullanılacaktır.'
              : `Randevu ID: ${id} - Mode: ${mode}`
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
            Randevu aktivitesi için detay sayfası burada oluşturulacaktır.
            <br />
            Location, Start Time, End Time, Organizer, Attendees, Meeting URL gibi alanlar eklenecektir.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentDetail;
