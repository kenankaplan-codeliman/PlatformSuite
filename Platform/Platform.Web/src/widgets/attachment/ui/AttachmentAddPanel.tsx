import { useRef, useState } from 'react';
// TODO: shared/ui'ye Form/Input/Select wrapper'ları eklenince migrate et;
// message için shared notification helper'ı eklenmeli.
// eslint-disable-next-line no-restricted-imports
import { Form, Input, Select, Space, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/ui/Button';
import { useUploadAttachmentDraft } from '../../../entities/attachment/api/useAttachmentMutations';
import type { AttachmentMetadataItem } from '../../../entities/attachment/model/types';

export interface DocumentTypeOption {
  value: string;
  label: string;
}

export interface AttachmentAddPanelProps {
  /** İzin verilen document type'lar — Select seçenekleri. İlk değer default. */
  documentTypes: DocumentTypeOption[];
  /** Dosya seçici 'accept' attribute'u (örn. ".pdf,.docx,image/*"). */
  accept?: string;
  /** Maksimum dosya boyutu — bayt cinsi. Varsayılan 50 MB. */
  maxFileSize?: number;
  /** Başarılı yükleme sonrası parent'a yeni metadata bildirir. */
  onUploaded: (metadata: AttachmentMetadataItem, documentType: string) => void;
  /** Form'u iptal eder (panel kapanır). */
  onCancel: () => void;
}

interface FormValues {
  documentType: string;
  subject?: string;
  description?: string;
}

const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Add Mode: önce DocumentType seçimi, sonra dosya picker, sonra Yükle.
 * Yüklenince onUploaded ile metadata parent'a verilir; parent listede pending
 * olarak gösterir ve form save'inde command'a association ekler.
 */
export function AttachmentAddPanel({
  documentTypes,
  accept,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  onUploaded,
  onCancel,
}: AttachmentAddPanelProps) {
  const { t } = useTranslation('widget.attachment');
  const [form] = Form.useForm<FormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const upload = useUploadAttachmentDraft();

  const selectFile = (file: File | null): boolean => {
    if (file && file.size > maxFileSize) {
      message.error(t('errors.fileTooLarge'));
      return false;
    }
    setSelectedFile(file);
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectFile(event.target.files?.[0] ?? null)) event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async (values: FormValues) => {
    if (!selectedFile) {
      message.error(t('errors.noFile'));
      return;
    }

    try {
      const result = await upload.mutateAsync({
        file: selectedFile,
        documentType: values.documentType,
        subject: values.subject,
        description: values.description,
      });
      onUploaded(result, values.documentType);
      form.resetFields();
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      message.error(t('errors.uploadFailed'));
    }
  };

  const defaultDocumentType = documentTypes[0]?.value ?? 'Other';

  return (
    <div style={{ border: '1px dashed #d9d9d9', borderRadius: 8, padding: 12, background: '#fafafa' }}>
      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ documentType: defaultDocumentType }}
      >
        <Form.Item
          name="documentType"
          label={t('uploader.documentType')}
          rules={[{ required: true }]}
        >
          <Select options={documentTypes} />
        </Form.Item>

        <Form.Item name="subject" label={t('uploader.subject')}>
          <Input maxLength={500} />
        </Form.Item>

        <Form.Item name="description" label={t('uploader.description')}>
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label={t('uploader.file')} required>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `1px dashed ${isDragging ? '#1677ff' : '#d9d9d9'}`,
              borderRadius: 8,
              background: isDragging ? '#f0f7ff' : '#fff',
              width: '100%',
              minHeight: 96,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: 12,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            <Button
              icon={<UploadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {t('uploader.choose')}
            </Button>
            <span style={{ fontSize: 12, color: selectedFile ? '#666' : '#999' }}>
              {selectedFile
                ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)`
                : t('uploader.dropHint')}
            </span>
          </div>
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={upload.isPending} disabled={!selectedFile}>
            {t('uploader.submit')}
          </Button>
          <Button onClick={onCancel}>{t('actions.cancel')}</Button>
        </Space>
      </Form>
    </div>
  );
}
