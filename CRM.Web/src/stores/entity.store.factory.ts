import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { StateType, useProcessState } from '@/stores/process.state.store';
import { handleError } from '@/hooks/useHandleError';
import type { PaginationParams } from '@/types/common.types';
import type { EntityReference } from '@/types/entity.lookup.types';

// ─── Service Adapter ──────────────────────────────────────────────────────────

export interface EntityServiceAdapter<TList, TDetail, TFilters, TStatus = never> {
  getList(page: number, pageSize: number, filters: TFilters): Promise<{ data: TList[]; hasMore: boolean }>;
  getById(id: string): Promise<TDetail>;
  create(data: unknown): Promise<TDetail>;
  update(data: unknown): Promise<TDetail>;
  delete(payload: { ids: string[] }): Promise<void>;
  setStatus(payload: { ids: string[]; isActive: boolean }): Promise<void>;
  assign(payload: { ids: string[]; ownerId: string }): Promise<void>;
  /** Toplu durum/aşama güncelleme — sadece status workflow'u olan entity'lerde tanımlanır */
  updateStatus?: (ids: string[], status: TStatus) => Promise<void>;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface EntityStoreConfig<TList, TDetail, TFilters, TStatus = never> {
  storeName: string;
  initialFilters: TFilters;
  defaultPageSize?: number;
  labels: { singular: string; plural: string };
  service: EntityServiceAdapter<TList, TDetail, TFilters, TStatus>;
}

// ─── Generic State Shape ──────────────────────────────────────────────────────

export interface BaseEntityState<TList, TDetail, TFilters, TStatus = never> {
  // List state
  items: TList[];
  hasMore: boolean;
  page: number;
  pageSize: number;
  filters: TFilters;
  selectedRowKeys: string[];

  // Detail state
  currentItem: TDetail | null;

  // Actions
  fetchItems(): Promise<void>;
  fetchItemById(id: string): Promise<void>;
  setPagination(params: PaginationParams): void;
  setFilters(filters: TFilters): void;
  resetFilters(): void;
  setSelectedRowKeys(keys: string[]): void;
  clearSelectedRowKeys(): void;
  createItem(data: unknown): Promise<TDetail>;
  updateItem(data: unknown): Promise<TDetail>;
  deleteItem(id: string): Promise<void>;

  // Bulk actions
  bulkDelete(): Promise<void>;
  bulkActivate(): Promise<void>;
  bulkDeactivate(): Promise<void>;
  bulkAssign(entity: EntityReference | EntityReference[] | null): Promise<void>;
  /** Yalnızca TStatus ≠ never olduğunda (Lead, Opportunity gibi) anlamlıdır */
  bulkUpdateStatus(status: TStatus): Promise<void>;

  // Row-level actions
  activateItem(id: string): Promise<void>;
  deactivateItem(id: string): Promise<void>;
  assignItem(id: string, entity: EntityReference | EntityReference[] | null): Promise<void>;

  setCurrentItem(item: TDetail | null): void;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createEntityStore<TList, TDetail, TFilters, TStatus = never>(
  config: EntityStoreConfig<TList, TDetail, TFilters, TStatus>
) {
  const { service, initialFilters, labels, storeName, defaultPageSize = 10 } = config;

  return create<BaseEntityState<TList, TDetail, TFilters, TStatus>>()(
    devtools(
      (set, get) => ({
        items: [],
        hasMore: false,
        page: 1,
        pageSize: defaultPageSize,
        filters: initialFilters,
        selectedRowKeys: [],
        currentItem: null,

        // ── Fetch ────────────────────────────────────────────────────────
        fetchItems: async () => {
          const { page, pageSize, filters } = get();
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.plural} yükleniyor...`, 'Lütfen bekleyiniz...');
            const response = await service.getList(page, pageSize, filters);
            set({ items: response.data, hasMore: response.hasMore });
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.plural} yüklenemedi`, handleError(error));
          }
        },

        fetchItemById: async (id: string) => {
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.singular} detayı yükleniyor...`, 'Lütfen bekleyiniz...');
            const item = await service.getById(id);
            set({ currentItem: item });
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.singular} detayı yüklenemedi`, handleError(error));
          }
        },

        // ── Pagination ───────────────────────────────────────────────────
        setPagination: (params: PaginationParams) => {
          const { page, pageSize } = get();
          const newPageSize = params.pageSize ?? pageSize;
          const finalPage =
            params.pageSize !== undefined && params.pageSize !== pageSize
              ? 1
              : (params.page ?? page);
          set({ page: finalPage, pageSize: newPageSize });
          get().fetchItems();
        },

        // ── Filters ──────────────────────────────────────────────────────
        setFilters: (filters: TFilters) => {
          set({ filters, page: 1 });
          get().fetchItems();
        },

        resetFilters: () => {
          set({ filters: initialFilters, page: 1 });
          get().fetchItems();
        },

        // ── Selection ────────────────────────────────────────────────────
        setSelectedRowKeys: (keys: string[]) => set({ selectedRowKeys: keys }),
        clearSelectedRowKeys: () => set({ selectedRowKeys: [] }),

        // ── CRUD ─────────────────────────────────────────────────────────
        createItem: async (data: unknown) => {
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.singular} oluşturuluyor...`, 'Lütfen bekleyiniz...');
            const newItem = await service.create(data);
            set({ currentItem: newItem });
            clearState();
            return newItem;
          } catch (error) {
            setState(StateType.Error, `${labels.singular} oluşturulamadı`, handleError(error));
            throw error;
          }
        },

        updateItem: async (data: unknown) => {
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.singular} güncelleniyor...`, 'Lütfen bekleyiniz...');
            const updated = await service.update(data);
            set({ currentItem: updated });
            clearState();
            return updated;
          } catch (error) {
            setState(StateType.Error, `${labels.singular} güncellenemedi`, handleError(error));
            throw error;
          }
        },

        deleteItem: async (id: string) => {
          const { setState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.singular} siliniyor...`, 'Lütfen bekleyiniz...');
            await service.delete({ ids: [id] });
            await get().fetchItems();
            get().clearSelectedRowKeys();
          } catch (error) {
            setState(StateType.Error, `${labels.singular} silinemedi`, handleError(error));
            throw error;
          }
        },

        // ── Bulk Actions ─────────────────────────────────────────────────
        bulkDelete: async () => {
          const { selectedRowKeys } = get();
          if (!selectedRowKeys.length) return;
          const { setState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.plural} siliniyor...`, 'Lütfen bekleyiniz...');
            await service.delete({ ids: selectedRowKeys });
            await get().fetchItems();
            get().clearSelectedRowKeys();
          } catch (error) {
            setState(StateType.Error, `${labels.plural} silinemedi`, handleError(error));
          }
        },

        bulkActivate: async () => {
          const { selectedRowKeys } = get();
          if (!selectedRowKeys.length) return;
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.plural} etkinleştiriliyor...`, 'Lütfen bekleyiniz...');
            await service.setStatus({ ids: selectedRowKeys, isActive: true });
            await get().fetchItems();
            get().clearSelectedRowKeys();
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.plural} etkinleştirilemedi`, handleError(error));
          }
        },

        bulkDeactivate: async () => {
          const { selectedRowKeys } = get();
          if (!selectedRowKeys.length) return;
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.plural} pasifleştiriliyor...`, 'Lütfen bekleyiniz...');
            await service.setStatus({ ids: selectedRowKeys, isActive: false });
            await get().fetchItems();
            get().clearSelectedRowKeys();
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.plural} pasifleştirilemedi`, handleError(error));
          }
        },

        bulkAssign: async (entity: EntityReference | EntityReference[] | null) => {
          const { selectedRowKeys } = get();
          if (!selectedRowKeys.length) return;
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.plural} atanıyor...`, 'Lütfen bekleyiniz...');
            const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
            if (!ownerId) return;
            await service.assign({ ids: selectedRowKeys, ownerId });
            await get().fetchItems();
            get().clearSelectedRowKeys();
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.plural} atanamadı`, handleError(error));
          }
        },

        // ── Bulk Status Update (status workflow'u olan entity'ler için) ───
        bulkUpdateStatus: async (status: TStatus) => {
          if (!service.updateStatus) return;
          const { selectedRowKeys } = get();
          if (!selectedRowKeys.length) return;
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, 'Durum güncelleniyor...', 'Lütfen bekleyiniz...');
            await service.updateStatus(selectedRowKeys, status);
            await get().fetchItems();
            get().clearSelectedRowKeys();
            clearState();
          } catch (error) {
            setState(StateType.Error, 'Durum güncellenemedi', handleError(error));
          }
        },

        // ── Row-level Actions ────────────────────────────────────────────
        activateItem: async (id: string) => {
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.singular} etkinleştiriliyor...`, 'Lütfen bekleyiniz...');
            await service.setStatus({ ids: [id], isActive: true });
            await get().fetchItems();
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.singular} etkinleştirilemedi`, handleError(error));
          }
        },

        deactivateItem: async (id: string) => {
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.singular} pasifleştiriliyor...`, 'Lütfen bekleyiniz...');
            await service.setStatus({ ids: [id], isActive: false });
            await get().fetchItems();
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.singular} pasifleştirilemedi`, handleError(error));
          }
        },

        assignItem: async (id: string, entity: EntityReference | EntityReference[] | null) => {
          const { setState, clearState } = useProcessState.getState();
          try {
            setState(StateType.Loading, `${labels.singular} atanıyor...`, 'Lütfen bekleyiniz...');
            const ownerId = Array.isArray(entity) ? entity[0]?.id : entity?.id;
            if (!ownerId) return;
            await service.assign({ ids: [id], ownerId });
            await get().fetchItems();
            clearState();
          } catch (error) {
            setState(StateType.Error, `${labels.singular} atanamadı`, handleError(error));
          }
        },

        setCurrentItem: (item: TDetail | null) => set({ currentItem: item }),
      }),
      { name: storeName }
    )
  );
}
