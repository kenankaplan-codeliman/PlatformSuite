import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Form } from 'antd';
import { StateType, useProcessState } from '@/stores/process.state.store';
import { useSmartBack } from '@/hooks/useSmartBack';

// ─── Types ───────────────────────────────────────────────────────────────────

export type DetailMode = 'view' | 'edit' | 'create';

export interface DetailPageConfig<TEntity> {
  /** Veri çekme fonksiyonu */
  fetchById: (id: string) => Promise<void>;

  /** Yeni kayıt oluşturma */
  createEntity: (values: Partial<TEntity>) => Promise<TEntity>;

  /** Mevcut kaydı güncelleme */
  updateEntity: (values: Partial<TEntity>) => Promise<TEntity>;

  /** Kayıt silme */
  deleteEntity: (id: string) => Promise<void>;

  /** Store'daki mevcut entity */
  currentEntity: TEntity | null;

  /** Store'daki entity'yi temizleme */
  clearCurrentEntity: () => void;

  /** Form alanlarını entity'den doldurma (dayjs dönüşümleri vb.) */
  mapEntityToForm: (entity: TEntity) => Record<string, any>;

  /** Form değerlerini entity formatına dönüştürme (toLocalISO vb.) */
  mapFormToEntity: (values: Record<string, any>, id?: string) => Partial<TEntity>;

  /** Yeni kayıt için default form değerleri */
  defaultFormValues: Record<string, any>;

  /** Listeleme sayfası path'i (geri dönüş için) */
  listPath: string;

  /** Kayıt sonrası yönlendirilecek path oluşturucu */
  getViewPath: (entity: TEntity) => string;

  /** İsteğe bağlı: Tamamla aksiyonu */
  completeEntity?: (id: string) => Promise<void>;

  /** İsteğe bağlı: İptal et aksiyonu */
  cancelEntity?: (id: string) => Promise<void>;
}

export interface DetailPageProps<TEntity> {
  mode?: DetailMode;
  entityId?: string;
  onModeChange?: (mode: DetailMode) => void;
  onSave?: (entity: TEntity) => void;
  onCancel?: () => void;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useDetailPage<TEntity>(
  config: DetailPageConfig<TEntity>,
  props: DetailPageProps<TEntity>
) {
  const {
    fetchById,
    createEntity,
    updateEntity,
    deleteEntity,
    currentEntity,
    clearCurrentEntity,
    mapEntityToForm,
    mapFormToEntity,
    defaultFormValues,
    listPath,
    getViewPath,
    completeEntity,
    cancelEntity,
  } = config;

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const { state } = useProcessState.getState();

  const urlMode = searchParams.get('mode') as DetailMode | null;
  const initialMode = props.mode || urlMode || 'view';
  const [mode, setMode] = useState<DetailMode>(initialMode);

  const entityId = props.entityId || params.id;
  const isNew = entityId === 'new' || !entityId;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create' || isNew;

  const isFirstRender = useRef(true);

  // ─── Mode Management ────────────────────────────────────────────────────

  const updateMode = useCallback(
    (newMode: DetailMode) => {
      setMode(newMode);
      if (!props.mode) {
        setSearchParams({ mode: newMode }, { replace: true });
      }
      props.onModeChange?.(newMode);
    },
    [props, setSearchParams]
  );

  // ─── Data Fetching ──────────────────────────────────────────────────────

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isNew && entityId) {
        fetchById(entityId);
      } else {
        clearCurrentEntity();
        setMode('create');
      }
    }
  }, [entityId, isNew, fetchById, clearCurrentEntity]);

  // ─── URL Sync ───────────────────────────────────────────────────────────

  useEffect(() => {
    const urlMode = searchParams.get('mode') as DetailMode | null;
    if (urlMode && urlMode !== mode && !isNew) {
      setMode(urlMode);
    }
  }, [searchParams, isNew]);

  // ─── Form Population ───────────────────────────────────────────────────


  useEffect(() => {
  if (currentEntity && !isNew) {
    // sadece edit/create modunda set et
    if (!isViewMode) {
      form.setFieldsValue(mapEntityToForm(currentEntity));
    }
  } else if (isNew) {
    form.resetFields();
    form.setFieldsValue(defaultFormValues);
  }
}, [currentEntity, form, isNew, isViewMode]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleBack = useSmartBack({ fallbackPath: listPath });

  const handleEdit = useCallback(() => {
    updateMode('edit');
  }, [updateMode]);

  const handleCancelEdit = useCallback(() => {
    if (isNew) {
      navigate(listPath);
    } else if (currentEntity) {
      form.setFieldsValue(mapEntityToForm(currentEntity));
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNew, navigate, listPath, form, currentEntity, updateMode, props]);

  const handleSave = useCallback(async () => {
    const values = await form.validateFields();
    const formattedValues = mapFormToEntity(values, entityId);

    if (isNew) {
      const created = await createEntity(formattedValues);
      props.onSave?.(created);
      navigate(getViewPath(created));
    } else if (entityId) {
      const updated = await updateEntity(formattedValues);
      props.onSave?.(updated);
      updateMode('view');
    }
  }, [form, isNew, entityId, createEntity, updateEntity, navigate, getViewPath, updateMode, props, mapFormToEntity]);

  const handleDelete = useCallback(async () => {
    if (!entityId || isNew) return;
    await deleteEntity(entityId);
    handleBack();
  }, [entityId, isNew, deleteEntity, handleBack]);

  const handleComplete = useCallback(async () => {
    if (!entityId || isNew || !completeEntity) return;
    await completeEntity(entityId);
  }, [entityId, isNew, completeEntity]);

  const handleCancelActivity = useCallback(async () => {
    if (!entityId || isNew || !cancelEntity) return;
    await cancelEntity(entityId);
  }, [entityId, isNew, cancelEntity]);

  return {
    // State
    form,
    mode,
    entityId,
    isNew,
    isViewMode,
    isEditMode,
    isCreateMode,
    currentEntity,
    isLoading: state === StateType.Loading,

    // Handlers
    handleEdit,
    handleCancelEdit,
    handleSave,
    handleDelete,
    handleComplete,
    handleCancelActivity,
    handleBack,
    updateMode,
  };
}