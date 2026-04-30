import { useState } from 'react';
import { Form, Input, Select, Space, Upload, message } from 'antd';
import type { UploadFile } from 'antd';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/ui/Button';
import { useEnumTranslation } from '../../../shared/lib/i18n/enum';
import { useUploadAttachment } from '../../../entities/attachment/api/useAttachmentMutations';
import type { DocumentType } from '../../../entities/attachment/model/types';

const DOCUMENT_TYPES: DocumentType[] = [
  'Other',
  'TicaretSicilGazetesi',
  'VergiLevhasi',
  'ImzaSirkuleri',
  'FaaliyetBelgesi',
  'KapasiteRaporu',
  'AnaSozlesme',
  'KurulusKarari',
  'TicaretSicilBelgesi',
  'MersisBelgesi',
  'MaliTablo',
  'BilancoBelgesi',
  'KrediDerecelendirme',
  'BankaReferansBelgesi',
  'IsoSertifikasi',
  'UrununUygunlukBelgesi',
  'AkreditasyonBelgesi',
  'Sozlesme',
  'Teklif',
  'Siparis',
  'Fatura',
  'Irsaliye',
  'Sartname',
  'TeknikDokuman',
  'VekaletName',
  'YetkiYazisi',
  'ReferansMektubu',
  'IflasSorgulama',
];

export interface AttachmentUploadProps {
  entityId: string;
  entityType: string;
}

interface FormValues {
  documentType: DocumentType;
  subject?: string;
  description?: string;
}

/**
 * Drag & drop yükleyici + DocumentType select + subject/description.
 * Submit'te FormData hazırlayıp `useUploadAttachment` ile API'ye gönderir.
 */
export function AttachmentUpload({ entityId, entityType }: AttachmentUploadProps) {
  const { t } = useTranslation('widget.attachment');
  const tDocType = useEnumTranslation('documentType');
  const [form] = Form.useForm<FormValues>();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const upload = useUploadAttachment();

  const documentTypeOptions = DOCUMENT_TYPES.map((value) => ({
    value,
    label: tDocType(value),
  }));

  const handleSubmit = async (values: FormValues) => {
    const file = files[0]?.originFileObj as File | undefined;
    if (!file) {
      message.error(t('errors.noFile'));
      return;
    }

    try {
      await upload.mutateAsync({
        file,
        entityId,
        entityType,
        documentType: values.documentType,
        subject: values.subject,
        description: values.description,
      });
      form.resetFields();
      setFiles([]);
    } catch {
      message.error(t('errors.uploadFailed'));
    }
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ documentType: 'Other' as DocumentType }}
    >
      <Form.Item label={t('uploader.dropzone')}>
        <Upload.Dragger
          beforeUpload={() => false}
          maxCount={1}
          fileList={files}
          onChange={(info) => setFiles(info.fileList.slice(-1))}
          onRemove={() => setFiles([])}
        >
          <p style={{ fontSize: 14, padding: '12px 0' }}>{t('uploader.dropzone')}</p>
          <p style={{ fontSize: 12, color: '#888' }}>{t('uploader.hint')}</p>
        </Upload.Dragger>
      </Form.Item>

      <Form.Item
        name="documentType"
        label={t('uploader.documentType')}
        rules={[{ required: true }]}
      >
        <Select options={documentTypeOptions} />
      </Form.Item>

      <Form.Item name="subject" label={t('uploader.subject')}>
        <Input maxLength={500} />
      </Form.Item>

      <Form.Item name="description" label={t('uploader.description')}>
        <Input.TextArea rows={2} />
      </Form.Item>

      <Space>
        <Button type="primary" htmlType="submit" loading={upload.isPending}>
          {t('uploader.submit')}
        </Button>
      </Space>
    </Form>
  );
}
