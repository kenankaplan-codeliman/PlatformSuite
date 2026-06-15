import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Drawer, FloatButton, Input, Space, Spin, Tag, Typography, message } from 'antd';
import { PaperClipOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import { attachmentDataSource } from '../../../entities/attachment/api/attachmentDataSource';
import { assistantDataSource } from '../api/assistantDataSource';
import { useAssistantChat } from '../api/useAssistantChat';
import type { AssistantTurn, ChatMessage, PendingAction, ResolveLink } from '../model/types';

export interface AssistantWidgetProps {
  /** entityType + id → app route. Verilmezse linkler düz metin gösterilir. */
  resolveLink?: ResolveLink;
  title?: string;
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 1e6)}`;

export function AssistantWidget({ resolveLink, title = 'CRM Asistanı' }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<AssistantTurn[]>([]);
  const [input, setInput] = useState('');
  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [confirming, setConfirming] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const chat = useAssistantChat();

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    try {
      const meta = await attachmentDataSource.uploadDraft({ file, documentType: 'AssistantUpload' });
      setAttachmentId(meta.id);
      setAttachmentName(file.name);
    } catch {
      message.error('Dosya yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if ((!text && !attachmentId) || chat.isPending) return;

    const userMessage: ChatMessage = {
      id: newId(),
      role: 'user',
      text: attachmentName ? `${text}\n📎 ${attachmentName}`.trim() : text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setPendingActions([]); // önceki bekleyen onayları temizle
    const sentAttachmentId = attachmentId;
    setAttachmentId(null);
    setAttachmentName(null);
    scrollToBottom();

    try {
      const response = await chat.mutateAsync({
        message: text,
        attachmentId: sentAttachmentId,
        history,
      });
      setHistory(response.history);
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', text: response.reply, links: response.links },
      ]);
      setPendingActions(response.pendingActions ?? []);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', text: 'Bir hata oluştu, lütfen tekrar deneyin.', isError: true },
      ]);
    } finally {
      scrollToBottom();
    }
  };

  const handleConfirm = async (action: PendingAction) => {
    setConfirming((s) => new Set(s).add(action.token));
    try {
      const res = await assistantDataSource.confirm(action.token);
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', text: res.reply, links: res.links, isError: res.isError },
      ]);
      setPendingActions((prev) => prev.filter((p) => p.token !== action.token));
    } catch {
      message.error('İşlem onaylanamadı (onay süresi dolmuş olabilir).');
    } finally {
      setConfirming((s) => {
        const n = new Set(s);
        n.delete(action.token);
        return n;
      });
      scrollToBottom();
    }
  };

  const handleReject = (action: PendingAction) => {
    setPendingActions((prev) => prev.filter((p) => p.token !== action.token));
    setMessages((prev) => [...prev, { id: newId(), role: 'assistant', text: 'İşlem iptal edildi.' }]);
  };

  return (
    <>
      <FloatButton
        icon={<RobotOutlined />}
        type="primary"
        tooltip={title}
        onClick={() => setOpen(true)}
      />

      <Drawer title={title} open={open} onClose={() => setOpen(false)} width={440} destroyOnHidden={false}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div ref={listRef} style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
            {messages.length === 0 && (
              <Typography.Paragraph type="secondary">
                Kartvizit görseli veya CSV yükleyebilir, analitik soru sorabilir ya da kayıt
                arayabilirsiniz.
              </Typography.Paragraph>
            )}

            <Space direction="vertical" size={10} style={{ width: '100%' }}>
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} resolveLink={resolveLink} />
              ))}
              {chat.isPending && (
                <div style={{ textAlign: 'left' }}>
                  <Spin size="small" /> <Typography.Text type="secondary">Yazıyor…</Typography.Text>
                </div>
              )}

              {pendingActions.map((action) => (
                <Card key={action.token} size="small" style={{ borderColor: '#faad14', background: '#fffbe6' }}>
                  <Typography.Text strong>Onay gerekiyor</Typography.Text>
                  <div style={{ margin: '4px 0 8px' }}>{action.summary}</div>
                  <Space>
                    <Button
                      type="primary"
                      size="small"
                      loading={confirming.has(action.token)}
                      onClick={() => void handleConfirm(action)}
                    >
                      Onayla
                    </Button>
                    <Button
                      size="small"
                      disabled={confirming.has(action.token)}
                      onClick={() => handleReject(action)}
                    >
                      İptal
                    </Button>
                  </Space>
                </Card>
              ))}
            </Space>
          </div>

          <div style={{ paddingTop: 12 }}>
            {attachmentName && (
              <Tag closable onClose={() => { setAttachmentId(null); setAttachmentName(null); }} style={{ marginBottom: 8 }}>
                📎 {attachmentName}
              </Tag>
            )}
            <Space.Compact style={{ width: '100%' }}>
              <Button
                icon={<PaperClipOutlined />}
                loading={uploading}
                onClick={() => fileInputRef.current?.click()}
                title="Kartvizit görseli veya CSV ekle"
              />
              <Input.TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Bir mesaj yazın…"
                autoSize={{ minRows: 1, maxRows: 4 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={chat.isPending}
                onClick={() => void send()}
              />
            </Space.Compact>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.csv"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}

function MessageBubble({ message: m, resolveLink }: { message: ChatMessage; resolveLink?: ResolveLink }) {
  const isUser = m.role === 'user';
  return (
    <div style={{ textAlign: isUser ? 'right' : 'left' }}>
      <div
        style={{
          display: 'inline-block',
          maxWidth: '85%',
          textAlign: 'left',
          padding: '8px 12px',
          borderRadius: 10,
          whiteSpace: 'pre-wrap',
          background: isUser ? '#1677ff' : m.isError ? '#fff1f0' : '#f5f5f5',
          color: isUser ? '#fff' : m.isError ? '#cf1322' : 'inherit',
        }}
      >
        {m.text}
        {m.links && m.links.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {m.links.map((link) => {
              const href = resolveLink?.(link.entityType, link.id);
              return href ? (
                <Link key={`${link.entityType}-${link.id}`} to={href}>
                  {link.name}
                </Link>
              ) : (
                <span key={`${link.entityType}-${link.id}`}>{link.name}</span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
