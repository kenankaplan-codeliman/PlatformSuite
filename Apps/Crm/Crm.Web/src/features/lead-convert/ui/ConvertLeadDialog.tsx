import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  RadioGroup,
  Checkbox,
  Space,
  Text,
  EntityLookupField,
  ServicePath,
  messageBox,
  type EntityReference,
} from '@platform/ui';
import { useNavigate } from 'react-router-dom';
import { useConvertLead } from '../../../entities/lead/api/useLeadMutations';
import { RoutePaths } from '../../../app/router/paths';

type AccountMode = 'create' | 'link' | 'none';

interface AccountLookupForm {
  existingAccount: EntityReference | null;
}

export interface ConvertLeadDialogProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
}

/**
 * Lead Convert dialog'u (kullanıcı niyeti → feature). Kullanıcı neyin
 * oluşturulacağını seçer: yeni firma / mevcut firmaya bağla / firma yok, kişi,
 * opsiyonel fırsat. Tek `convert` komutuyla atomik dönüşüm yapılır; başarıda
 * oluşturulan kayda yönlendirir.
 */
export function ConvertLeadDialog({ open, onClose, leadId }: ConvertLeadDialogProps) {
  const { t } = useTranslation('entity.lead');
  const navigate = useNavigate();
  const convert = useConvertLead();

  const [accountMode, setAccountMode] = useState<AccountMode>('create');
  const [createContact, setCreateContact] = useState(true);
  const [createOpportunity, setCreateOpportunity] = useState(false);

  const { control, reset } = useForm<AccountLookupForm>({
    defaultValues: { existingAccount: null },
  });
  const existingAccount = useWatch({ control, name: 'existingAccount' });

  const close = () => {
    reset({ existingAccount: null });
    setAccountMode('create');
    setCreateContact(true);
    setCreateOpportunity(false);
    onClose();
  };

  const handleOk = async () => {
    if (accountMode === 'link' && !existingAccount) {
      messageBox.error(t('convert.errors.selectAccount'));
      return;
    }
    if (accountMode === 'none' && !createContact) {
      messageBox.error(t('convert.errors.nothingToConvert'));
      return;
    }

    try {
      const result = await convert.mutateAsync({
        id: leadId,
        createAccount: accountMode === 'create',
        accountId: accountMode === 'link' ? existingAccount?.id ?? null : null,
        createContact,
        createOpportunity,
      });
      messageBox.success(t('convert.success'));
      close();
      if (result.accountId) navigate(RoutePaths.AccountView(result.accountId));
      else if (result.contactId) navigate(RoutePaths.ContactView(result.contactId));
    } catch {
      messageBox.error(t('convert.errors.failed'));
    }
  };

  const opportunityDisabled = accountMode === 'none';

  return (
    <Modal
      open={open}
      title={t('convert.title')}
      okText={t('convert.confirm')}
      cancelText={t('convert.cancel')}
      onOk={handleOk}
      onCancel={close}
      confirmLoading={convert.isPending}
      destroyOnHidden
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>{t('convert.accountSection')}</Text>
          <RadioGroup<AccountMode>
            value={accountMode}
            onChange={(next) => {
              setAccountMode(next);
              if (next === 'none') setCreateOpportunity(false);
            }}
            style={{ marginTop: 8 }}
            options={[
              { value: 'create', label: t('convert.account.create') },
              { value: 'link', label: t('convert.account.link') },
              { value: 'none', label: t('convert.account.none') },
            ]}
          />
          {accountMode === 'link' && (
            <div style={{ marginTop: 8 }}>
              <EntityLookupField<AccountLookupForm>
                name="existingAccount"
                control={control}
                servicePath={ServicePath.Account.Search}
                entityType="Account"
                label={t('convert.account.lookupLabel')}
                allowClear
                force="editable"
              />
            </div>
          )}
        </div>

        <Checkbox checked={createContact} onChange={setCreateContact}>
          {t('convert.createContact')}
        </Checkbox>

        <Checkbox
          checked={createOpportunity}
          disabled={opportunityDisabled}
          onChange={setCreateOpportunity}
        >
          {t('convert.createOpportunity')}
        </Checkbox>
      </Space>
    </Modal>
  );
}
