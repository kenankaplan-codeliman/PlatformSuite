import { useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Space, Result } from 'antd';
import { ArrowLeftOutlined, CheckSquareOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TaskDetail: React.FC = () => {
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
            {isNew ? 'Yeni Görev' : mode === 'edit' ? 'Görev Düzenle' : 'Görev Detayı'}
          </Title>
        </Space>
      </Card>

      <Card>
        <Result
          icon={<CheckSquareOutlined style={{ color: '#faad14' }} />}
          title="Görev Detay Sayfası"
          subTitle={
            isNew
              ? 'Bu sayfa yeni görev oluşturmak için kullanılacaktır.'
              : `Görev ID: ${id} - Mode: ${mode}`
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
            Görev aktivitesi için detay sayfası burada oluşturulacaktır.
            <br />
            Task Description, Percent Complete, Reminder, Start Date, Due Date gibi alanlar eklenecektir.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default TaskDetail;
