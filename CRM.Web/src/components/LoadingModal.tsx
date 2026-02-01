import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Modal, Spin, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;


interface LoadingModalContextType {
  showLoading: (title?: string, description?: string) => void;
  showSuccess: (title?: string, description?: string) => void;
  showError: (title?: string, description?: string) => void;
  closeLoading: (delayTime?: number) => void;
}

const LoadingModalContext = createContext<LoadingModalContextType | undefined>(undefined);

export const useLoadingModal = () => {
  const context = useContext(LoadingModalContext);
  if (!context) {
    throw new Error('useLoadingModal must be used within LoadingModalProvider');
  }
  return context;
};

interface LoadingModalProviderProps {
  children: ReactNode;
}

export const LoadingModalProvider: React.FC<LoadingModalProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState('processing');
  const [title, setTitle] = useState<string>('Processing...');
  const [description, setDescription] = useState<string>('Please wait...');

  const showLoading = (successTitle?: string, successDescription?: string) => {
    setVisible(true);
    setStep('processing');
    setTitle(successTitle || 'Processing...');
    setDescription(successDescription || 'Please wait...');
  };

  const showSuccess = (successTitle?: string, successDescription?: string) => {
    setVisible(true);
    setStep('success');
    setTitle(successTitle || 'Success!');
    setDescription(successDescription || 'Operation completed successfully');
  };

  const showError = (errorTitle?: string, errorDescription?: string) => {
    setVisible(true);
    setStep('error');
    setTitle(errorTitle || 'Error');
    setDescription(errorDescription || 'Something went wrong');
  };

  const closeLoading = (delayTime?: number) => {
    setTimeout(() => {
      setVisible(false);

      setTimeout(() => {
        setStep('processing');
        setTitle('Processing...');
        setDescription('Please wait...');
      }, 300);
      
    }, delayTime ?? 100);
  };

  const getIcon = () => {
    switch (step) {
      case 'success':
        return <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />;
      default:
        return <Spin size="large" />;
    }
  };

  const getTitleColor = () => {
    switch (step) {
      case 'success':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      default:
        return undefined;
    }
  };

  return (
    <LoadingModalContext.Provider
      value={{
        showLoading,
        showSuccess,
        showError,
        closeLoading,
      }}
    >
      {children}

      <Modal
        open={visible}
        closable={false}
        footer={null}
        centered
        width={400}
        maskClosable={false}
      >
        <Space
          orientation="vertical"
          size="large"
          style={{
            width: '100%',
            padding: '20px 0',
            textAlign: 'center',
          }}
        >
          {getIcon()}

          <Title level={4} style={{ margin: 0, color: getTitleColor() }}>
            {title}
          </Title>

          {description && (
            <Text type="secondary" style={{ display: 'block' }}>
              {description}
            </Text>
          )}
        </Space>
      </Modal>
    </LoadingModalContext.Provider>
  );
};