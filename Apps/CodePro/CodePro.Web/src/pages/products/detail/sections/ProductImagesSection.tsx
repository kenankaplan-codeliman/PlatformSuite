import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  PictureOutlined,
  StarFilled,
  StarOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Alert, Button, FormSection, Spinner, useFormMode } from '@platform/ui';
import { productImageDataSource } from '../../../../entities/product-image/api/productImageDataSource';
import { useProductImageListQuery } from '../../../../entities/product-image/api/useProductImageQueries';
import {
  useDeleteProductImage,
  useReorderProductImages,
  useSetDefaultProductImage,
  useUploadProductImage,
} from '../../../../entities/product-image/api/useProductImageMutations';
import type { ProductImageItem } from '../../../../entities/product-image/model/types';

export interface ProductImagesSectionProps {
  productId: string | undefined;
}

/**
 * Ürün görselleri yönetim bölümü. View modunda salt-okunur galeri,
 * edit/new modunda yükleme + silme + sıralama + varsayılan ayarlama destekler.
 *
 * `productId` yoksa (yeni mod, henüz kaydedilmedi) yükleme kapalı; kullanıcıya
 * önce ürünü kaydetmesi gerektiği bilgisi verilir.
 */
export function ProductImagesSection({ productId }: ProductImagesSectionProps) {
  const { t } = useTranslation('entity.product-image');
  const { mode } = useFormMode();
  const isReadOnly = mode === 'view';
  const canUpload = !isReadOnly && !!productId;

  const query = useProductImageListQuery(productId);
  const uploadMutation = useUploadProductImage();
  const deleteMutation = useDeleteProductImage();
  const reorderMutation = useReorderProductImages();
  const setDefaultMutation = useSetDefaultProductImage();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const images = query.data ?? [];

  const handleUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!productId) return;
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        await uploadMutation.mutateAsync({
          productId,
          file,
          sortOrder: images.length,
        });
      } catch {
        // Hata: mutation state üzerinden UI'a yansıtılır.
      }
    }
  };

  const handleDelete = (id: string) => {
    if (!productId) return;
    if (!window.confirm(t('deleteConfirmTitle'))) return;
    deleteMutation.mutate({ id, productId });
  };

  const handleSetDefault = (imageId: string) => {
    if (!productId) return;
    setDefaultMutation.mutate({ productId, imageId });
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    if (!productId) return;
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const a = images[index];
    const b = images[target];
    if (!a || !b) return;
    const next = [...images];
    next[index] = b;
    next[target] = a;
    reorderMutation.mutate({
      productId,
      imageIds: next.map((i) => i.id),
    });
  };

  return (
    <FormSection
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <PictureOutlined />
          <span>{t('section')}</span>
        </span>
      }
      extra={
        canUpload ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleUploadChange}
            />
            <Button
              type="primary"
              icon={<UploadOutlined />}
              loading={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {t('addImage')}
            </Button>
          </>
        ) : undefined
      }
    >
      {!productId ? (
        <Alert type="info" message={t('empty')} />
      ) : query.isLoading ? (
        <Spinner />
      ) : query.isError ? (
        <Alert type="error" message={t('errors.uploadFailed')} />
      ) : images.length === 0 ? (
        <Alert type="info" message={t('empty')} />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          {images.map((image, index) => (
            <ProductImageCard
              key={image.id}
              image={image}
              index={index}
              total={images.length}
              isReadOnly={isReadOnly}
              onMove={(direction) => handleMove(index, direction)}
              onDelete={() => handleDelete(image.id)}
              onSetDefault={() => handleSetDefault(image.id)}
            />
          ))}
        </div>
      )}
    </FormSection>
  );
}

interface ProductImageCardProps {
  image: ProductImageItem;
  index: number;
  total: number;
  isReadOnly: boolean;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

function ProductImageCard({
  image,
  index,
  total,
  isReadOnly,
  onMove,
  onDelete,
  onSetDefault,
}: ProductImageCardProps) {
  const { t } = useTranslation('entity.product-image');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const objectUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    productImageDataSource
      .getThumbnailObjectUrl(image.id)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrlRef.current = url;
        setThumbnailUrl(url);
      })
      .catch(() => {
        // Görsel okunamadı; fallback ikonla devam.
      })
      .finally(() => {
        if (!cancelled) setThumbnailLoaded(true);
      });

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = undefined;
      }
    };
  }, [image.id]);

  return (
    <div
      style={{
        position: 'relative',
        border: image.isDefault ? '2px solid #faad14' : '1px solid #f0f0f0',
        borderRadius: 6,
        overflow: 'hidden',
        background: '#fafafa',
      }}
    >
      <div
        style={{
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!thumbnailLoaded ? (
          <Spinner />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={image.fileName}
            style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }}
          />
        ) : (
          <PictureOutlined style={{ fontSize: 32, color: '#bfbfbf' }} />
        )}
      </div>

      <div
        style={{
          padding: '4px 8px',
          fontSize: 12,
          color: '#595959',
          borderTop: '1px solid #f0f0f0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          background: '#fff',
        }}
        title={image.fileName}
      >
        {image.fileName}
      </div>

      {image.isDefault && (
        <div
          title={t('isDefault')}
          style={{
            position: 'absolute',
            top: 6,
            left: 6,
            background: '#faad14',
            color: '#fff',
            borderRadius: 12,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          <StarFilled style={{ fontSize: 10 }} />
          <span>{t('default')}</span>
        </div>
      )}

      {!isReadOnly && (
        <div
          style={{ position: 'absolute', top: 6, right: 6 }}
          title={t('deleteConfirmTitle')}
        >
          <Button
            danger
            type="primary"
            size="small"
            icon={<DeleteOutlined />}
            onClick={onDelete}
            aria-label={t('deleteConfirmTitle')}
          />
        </div>
      )}

      {!isReadOnly && (
        <>
          <div
            style={{
              display: 'flex',
              borderTop: '1px solid #f0f0f0',
              background: '#fff',
            }}
          >
            <div style={{ flex: 1, borderRight: '1px solid #f0f0f0' }}>
              <Button
                type="text"
                block
                size="small"
                icon={<ArrowLeftOutlined />}
                disabled={index === 0}
                onClick={() => onMove(-1)}
              >
                {t('previous')}
              </Button>
            </div>
            <div style={{ flex: 1 }}>
              <Button
                type="text"
                block
                size="small"
                disabled={index === total - 1}
                onClick={() => onMove(1)}
              >
                {t('next')}
                <ArrowRightOutlined />
              </Button>
            </div>
          </div>
          <div
            style={{ borderTop: '1px solid #f0f0f0', background: '#fff' }}
            title={image.isDefault ? t('isDefault') : t('setDefault')}
          >
            <Button
              type="text"
              block
              size="small"
              disabled={image.isDefault}
              onClick={onSetDefault}
              icon={
                image.isDefault ? (
                  <StarFilled style={{ color: '#faad14' }} />
                ) : (
                  <StarOutlined />
                )
              }
            >
              {image.isDefault ? t('isDefault') : t('setDefault')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
