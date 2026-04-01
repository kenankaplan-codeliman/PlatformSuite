import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Form } from 'antd';
import { StateType, useProcessState } from '@/stores/process.state.store';
import { useSmartBack } from '@/hooks/useSmartBack';

// ─── Types ───────────────────────────────────────────────────────────────────

export type DetailMode = 'view' | 'edit' | 'create';

// Ant Design form değerleri runtime'da shape'i bilinmeyen key-value çiftleridir;
// burada `any` kasıtlı olarak kullanılmaktadır.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = Record<string, any>;

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
  mapEntityToForm: (entity: TEntity) => FormValues;

  /** Form değerlerini entity formatına dönüştürme (toLocalISO vb.) */
  mapFormToEntity: (values: FormValues, id?: string) => Partial<TEntity>;

  /** Yeni kayıt için default form değerleri */
  defaultFormValues: FormValues;

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
    listPath,
    getViewPath,
    completeEntity,
    cancelEntity,
  } = config;

  // Her render'da yeni referans üretilen callback'leri ref'e al.
  // Bu sayede useEffect/useCallback dep array'leri sabit kalır,
  // ama fonksiyon gövdesi her zaman güncel sürümü çağırır.
  const mapEntityToFormRef = useRef(config.mapEntityToForm);
  mapEntityToFormRef.current = config.mapEntityToForm;

  const mapFormToEntityRef = useRef(config.mapFormToEntity);
  mapFormToEntityRef.current = config.mapFormToEntity;

  const defaultFormValuesRef = useRef(config.defaultFormValues);
  defaultFormValuesRef.current = config.defaultFormValues;

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
      // Sadece edit modunda form doldur — ref sayesinde daima güncel mapEntityToForm çağrılır
      if (!isViewMode) {
        form.setFieldsValue(mapEntityToFormRef.current(currentEntity));
      }
    } else if (isNew) {
      form.resetFields();
      form.setFieldsValue(defaultFormValuesRef.current);
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
      form.setFieldsValue(mapEntityToFormRef.current(currentEntity));
      updateMode('view');
    }
    props.onCancel?.();
  }, [isNew, navigate, listPath, form, currentEntity, updateMode, props]);

  const handleSave = useCallback(async () => {
    // validateFields rejection'u Ant Design'ın kendi inline validasyon mesajlarını tetikler;
    // bu satırın fırlattığı hata kasıtlı olarak yukarıya taşınır.
    const values = await form.validateFields();

    try {
      const formattedValues = mapFormToEntityRef.current(values, entityId);

      if (isNew) {
        const created = await createEntity(formattedValues);
        props.onSave?.(created);
        navigate(getViewPath(created));
      } else if (entityId) {
        const updated = await updateEntity(formattedValues);
        props.onSave?.(updated);
        updateMode('view');
      }
    } catch {
      // API/network hataları store'da StateType.Error ile gösterildi.
      // Navigasyon yapılmaz — kullanıcı formu düzeltebilir.
    }
  }, [form, isNew, entityId, createEntity, updateEntity, navigate, getViewPath, updateMode, props]);

  const handleDelete = useCallback(async () => {
    if (!entityId || isNew) return;
    try {
      await deleteEntity(entityId);
      handleBack();
    } catch {
      // Hata store'da gösterildi — navigasyon yapılmaz
    }
  }, [entityId, isNew, deleteEntity, handleBack]);

  const handleComplete = useCallback(async () => {
    if (!entityId || isNew || !completeEntity) return;
    try {
      await completeEntity(entityId);
    } catch {
      // Hata store'da gösterildi
    }
  }, [entityId, isNew, completeEntity]);

  const handleCancelActivity = useCallback(async () => {
    if (!entityId || isNew || !cancelEntity) return;
    try {
      await cancelEntity(entityId);
    } catch {
      // Hata store'da gösterildi
    }
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