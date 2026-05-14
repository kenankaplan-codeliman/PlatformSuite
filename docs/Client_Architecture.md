# Client Architecture

> PlatformSuite monorepo'sundaki React frontend uygulamaları (Crm.Web, CodePro.Web) ve `@platform/ui` paylaşılan paketinin mimari rehberidir. Hedef: ekipteki herkesin "bu dosya nereye gider?" sorusunu aynı şekilde cevaplayabilmesi.

---

## 1. Felsefe

Bu proje **MVI (Model–View–Intent)** state yönetim disiplinini, **Feature-Sliced Design (FSD)** katman ayrımıyla birleştirir. Clean Architecture'ın temel ilkesine sadık kalınır: **bağımlılıklar içe doğru akar**. Alt katman üst katmanı tanımaz.

Dört temel kural:

1. **Tek yönlü veri akışı.** Kullanıcı bir *intent* üretir → reducer yeni *state* üretir → *view* state'i render eder. Yan etkiler (API çağrıları, navigasyon) açıkça tanımlı yerlerde gerçekleşir.
2. **Bağımlılık yönü yukarıdan aşağıya.** `pages → widgets → features → entities → shared`. Ters import yasaktır.
3. **Erken soyutlama yok.** Bir parça birden fazla yerde kullanılmadıkça ortak alana taşınmaz. Yanlış soyutlama, kopyalamadan daha pahalıdır.
4. **Multi-app izolasyon.** `@platform/ui` paketi (`Platform/Platform.Web`) ortak primitifleri (DetailPageLayout, TextField, ServicePath, useRouteMode, ...) servis eder; her app (`Apps/Crm/Crm.Web`, `Apps/CodePro/CodePro.Web`) kendi entity/feature/page'lerini kendi içinde tanımlar. **Cross-app entity/page importu yasak.**

---

## 0. Multi-App Frontend Yapısı

```
PlatformSuite/
├── Platform/Platform.Web/        # @platform/ui — paylaşılan UI kütüphanesi
│   └── src/
│       ├── shared/ui/            # DetailPageLayout, ListPageLayout, TextField, ...
│       ├── shared/api/           # httpClient, ServicePath (Platform endpoint'leri), errorMapper
│       ├── shared/hooks/         # useRouteMode, ...
│       ├── shared/lib/i18n/      # useEnumTranslation
│       ├── shared/types/         # Pagination, EntityReference, ApiError, FormMode
│       ├── entities/             # platform-merkezli (user, app-user, app-role, attachment, activity, organization)
│       ├── features/             # auth-login, auth-logout, ...
│       ├── pages/                # LoginPage, HomePage, ActivitiesListPage, AppUsersListPage, ...
│       ├── widgets/              # AppShell, AppHeader, AppSidebar, AttachmentPanel
│       ├── app/                  # AppProviders, AuthGuard, RoutePaths/Patterns (platform varsayılanları)
│       └── index.ts              # public barrel — Crm.Web ve CodePro.Web bunu tüketir
├── Apps/Crm/Crm.Web/             # CRM app'i (@app/crm-web)
│   └── src/
│       ├── entities/             # account, contact, lead, opportunity
│       ├── pages/                # accounts/, contacts/, leads/, opportunities/
│       ├── shared/api/queryKeys.ts # accountKeys, contactKeys, leadKeys, opportunityKeys
│       ├── shared/api/servicePaths.ts # CrmServicePath (Lead, Opportunity)
│       ├── app/router/{paths,routes}.tsx # CRM rotaları
│       ├── app/menu/useCrmMenu.tsx
│       └── app/i18n.config.ts    # registerCrmTranslations
└── Apps/CodePro/CodePro.Web/     # CodePro app'i
    └── src/
        ├── entities/             # supplier, brand, product, purchase-order, ...
        ├── pages/                # suppliers/, products/, purchase-orders/, ...
        ├── shared/api/{queryKeys,servicePaths}.ts # supplierKeys + CodeProServicePath
        ├── app/router/...
        └── app/i18n.config.ts    # registerCodeProTranslations
```

### 0.1 `@platform/ui` Paket Modeli

Platform.Web pnpm workspace'inde `@platform/ui` adıyla yayımlanır (`package.json`). `Platform.Web/src/index.ts` public barrel'dır; sadece bu dosyadan export edilen tipler/component'ler app'lere açıktır.

Crm.Web ve CodePro.Web `@platform/ui`'ı normal bir paket gibi tüketir:

```ts
import {
  DetailPageLayout, ListPageLayout, FormSection, TextField, NumberField, SelectField,
  EntityLookupField, EntityRelationTable, useRouteMode, useEnumTranslation,
  httpClient, ServicePath, mapAxiosError,
  type EntityReference, type PagedResult, type AppError,
  RoutePaths as PlatformRoutePaths,
} from '@platform/ui';
```

App'in kendi shared'ı `@platform/ui`'ı genişletir (extend):

- **paths.ts:** `...PlatformRoutePaths` + app rotaları
- **servicePaths.ts:** Platform `ServicePath`'i tüketir + app'e özgü `CrmServicePath` / `CodeProServicePath` ekler
- **queryKeys.ts:** `@platform/ui`'dan gelen platform key'leri (activityKeys, authKeys vb.) tüketilirken, app key'leri (accountKeys, supplierKeys, leadKeys) burada tanımlanır

### 0.2 Yer Ayrımı Kuralı

| Component / hook / type kim için? | Konum |
|---|---|
| Tüm app'lerde aynı semantikle (Button, DataTable, DetailPageLayout) | `Platform.Web/src/shared/ui/` + `index.ts` export |
| Platform-merkezli entity (user, app-role, organization, attachment, activity) | `Platform.Web/src/entities/<x>/` |
| App'in iş kavramı (Account → CRM, Supplier → CodePro) | `Apps/<App>/<App>.Web/src/entities/<x>/` |
| Auth (Login/Logout/...) | `Platform.Web/src/features/auth-*/` (paylaşılan) |
| App-spesifik feature (`order-line-editor`) | `Apps/<App>/<App>.Web/src/features/<entity>-<eylem>/` |
| App-spesifik sayfa | `Apps/<App>/<App>.Web/src/pages/...` |

---

## 2. Katmanlar

### 2.1 `app/` — Uygulama Kabuğu

Uygulama seviyesinde **bir kez** yapılandırılan şeyler burada yaşar: provider ağacı, router tanımı, global store kökü, yetkilendirme kabuğu.

İçeriği:
- `providers/` — QueryClient, Theme, Auth, Router provider kompozisyonu
- `router/` — route tanımları, guard'lar (AuthGuard, RoleGuard)
- `store/` — global UI state (sidebar açık mı, aktif toast listesi)

Kural: `app/` hiçbir yerden import edilmez. O sadece giriş noktasıdır.

### 2.2 `shared/` — Domain'den Bağımsız Altyapı

Hiçbir iş kavramı bilmeyen yapı taşları. `Button`, `DataTable`, `httpClient`, `formatCurrency`, mode-aware form primitifleri, `DetailPageLayout`, `ListPageLayout` gibi. Bir geliştirici `shared/` içindeki herhangi bir dosyaya bakıp "bu hangi projeye ait?" sorusuna cevap verememeli.

İçeriği:
- `ui/` — tasarım sistemi component'leri ve form/page primitifleri
- `api/` — `httpClient`, interceptor'lar, `queryKeys` fabrikası, `errorMapper`
- `lib/` — `date`, `currency`, `validation`, `permissions` yardımcıları
- `hooks/` — `useDebounce`, `usePagination`, `useMediaQuery`, `useRouteMode` gibi generic hook'lar
- `config/` — `env`, `constants`
- `types/` — `Pagination`, `ApiError`, `FormMode` gibi ortak tipler

Kural: `shared/` yalnızca `shared/` içinden import yapabilir. Domain tipi (Account, Order) buraya girmez.

### 2.3 `entities/` — Domain Nesneleri

İş kavramlarının **teknoloji-bağımsız** temsilleri. Her entity üç alt klasörden oluşur: `model/`, `api/`, `ui/`.

- `model/` — TypeScript tipleri, zod şemaları, mapper'lar, domain hesaplamaları, field permission tanımları
- `api/` — DataSource (HTTP çağrıları) ve query hook'ları
- `ui/` — entity'ye ait küçük, yeniden kullanılabilir görsel parçalar (avatar, badge, lookup)

CRM için entity'ler: `account`, `order`, `activity`. `OrderDetail` ayrı entity değildir — `order` aggregate'i altında yaşar.

Kural: Bir entity başka bir entity'yi **tanımaz**. İlişkiler feature veya widget katmanında kurulur.

### 2.4 `features/` — Kullanıcı Niyetleri (Use Case'ler)

Kullanıcının yapmaya çalıştığı her iş bir feature'dır: "order satırı düzenle", "aktiviteyi tamamla", "login". Feature isimleri **fiil içerir** ve `<entity>-<eylem>` formatındadır.

Her feature aynı şablona uyar:
- `model/` — intent tipleri, reducer, store (MVI çekirdeği)
- `api/` — mutation hook'ları
- `ui/` — feature'ı sunan component'ler (form, dialog, button)

Feature'lar birden fazla entity'yi kullanabilir ama başka bir feature'ı **import etmez**. Feature'lar kardeştir, hiyerarşik değildir.

### 2.5 `widgets/` — Feature Kompozisyonları

Birden fazla feature'ı veya entity'yi bir araya getiren, **birden fazla sayfada kullanılabilen** büyük parçalar.

### 2.6 `pages/` — Route'larla Eşleşen Kompozisyon Noktaları

Sayfalar sadece **kompozisyon** yapar. İş mantığı içermez. Route parametrelerini alır, `DetailPageLayout` veya `ListPageLayout` altında widget ve feature'ları bir araya getirir.

Bir sayfa dosyası 50 satırı geçtiyse muhtemelen içinden bir widget veya feature çıkarılmalıdır.

---

## 3. Component Konumlandırma Kararı

| Soru | Cevap | Konum |
|---|---|---|
| Domain kavramı bilmiyor mu? (Button, TextField, DataTable) | Evet | `shared/ui/` |
| Tek bir entity'ye ait, basit görsel mi? (Avatar, Badge) | Evet | `entities/<x>/ui/` |
| Bir kullanıcı niyetini mi temsil ediyor? (Form, Dialog) | Evet | `features/<x>-<eylem>/ui/` |
| Birden fazla sayfada kullanılan kompozisyon mu? | Evet | `widgets/<ad>/ui/` |
| Sadece tek bir sayfada mı kullanılıyor? | Evet | `pages/<sayfa>/ui/` |

**Altın kural:** Aynı component iki farklı sayfada kullanılmaya başlandığında `pages/` dışına **promote** edilir. Önceden değil.

---

## 4. MVI Akışı

```
User Action → Intent → Reducer → State → View
                ↑                           │
                └───────────────────────────┘
```

### 4.1 Intent

```ts
type OrderLineIntent =
  | { type: 'ADD_LINE'; productId: string }
  | { type: 'REMOVE_LINE'; lineId: string }
  | { type: 'UPDATE_QUANTITY'; lineId: string; quantity: number };
```

### 4.2 Reducer — Saf Fonksiyon

`(state, intent) => state`. Yan etki yok. Test edilmesi kolay.

### 4.3 Store

- **Küçük feature, tek component:** `useReducer`
- **Paylaşılan state, birden fazla component:** Zustand
- **Server state:** TanStack Query (client state'le karıştırılmaz)

### 4.4 Yan Etkiler

API çağrıları reducer'da yapılmaz. Mutation hook tetikler, sonucu intent olarak geri besler.

---

## 5. Veri Katmanı

### 5.1 DataSource

HTTP çağrıları **sadece** `entities/<x>/api/` içinde yapılır. Feature'lar ve widget'lar doğrudan `axios` çağırmaz. DTO → domain model dönüşümü `mappers.ts` içinde yapılır.

### 5.2 Query Keys — Merkezi Fabrika

`shared/api/queryKeys.ts` içinde hiyerarşik:

```ts
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters) => [...accountKeys.lists(), filters] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id) => [...accountKeys.details(), id] as const,
  activities: (id) => [...accountKeys.detail(id), 'activities'] as const,
};
```

### 5.3 Cache Invalidation

- Create/Update/Delete sonrası ilgili entity'nin `lists()` ve `detail(id)` invalidate edilir
- Çapraz entity etkileri `onSuccess` callback'inde açıkça yönetilir
- Default `staleTime`: 30 saniye; referans veriler için 5 dakika

---

## 6. Detail Page Pattern

Her entity'nin tek bir Detail sayfası vardır. Bu sayfa üç moda hizmet eder: `new`, `edit`, `view`.

### 6.1 Route Şeması

Tüm entity'ler için aynı şema kullanılır:

```
/<entity>                 → liste
/<entity>/new             → yeni kayıt (mode: 'new')
/<entity>/:id             → görüntüleme (mode: 'view')
/<entity>/:id/edit        → düzenleme (mode: 'edit')
```

### 6.2 Mode Detection — URL'den

Mode URL'den çıkarılır, state'te tutulmaz. State'te tutulması browser geri tuşunu bozar, deep-link paylaşımını imkansızlaştırır, refresh'te mode'u kaybettirir.

```ts
// shared/hooks/useRouteMode.ts
export function useRouteMode(): FormMode {
  const { id } = useParams();
  const location = useLocation();
  if (!id) return 'new';
  if (location.pathname.endsWith('/edit')) return 'edit';
  return 'view';
}
```

### 6.3 DetailPageLayout — Ortak İskelet

Tüm Detail sayfaları `DetailPageLayout` kullanır. Layout şunları üstlenir:

- Mode detection (URL'den, `modeOverride` prop'u varsa o kazanır)
- Veri fetch (`useQuery`, mode !== 'new' için)
- Form instance (`react-hook-form` + zod resolver)
- `defaultValues`'ın fetch edilen veriyle senkronizasyonu (`reset` ile)
- Loading/error state'leri
- `FormModeProvider` ve `FormProvider` sarmalama
- Save/Cancel/Delete akışları
- Save sonrası navigasyon
- Dirty guard (kaydedilmemiş değişiklikler için çıkış uyarısı)

```tsx
// shared/ui/detail-page/DetailPageLayout.tsx
type DetailPageLayoutProps<TModel, TSchema> = {
  entityType: string;
  useEntityQuery: (id: string, options?: QueryOptions) => UseQueryResult<TModel>;
  useUpsertMutation: () => UseMutationResult<TModel, Error, TModel>;
  useDeleteMutation?: () => UseMutationResult<void, Error, string>;
  schema: TSchema;
  title: (mode: FormMode, data?: TModel) => string;
  fieldPermissions?: FieldPermissionMap;
  modeOverride?: FormMode;
  afterSaveNavigation?: 'view' | 'edit' | 'list';
  showSaveAndContinue?: boolean;
  children: React.ReactNode;
};
```

### 6.4 Entity Detail Sayfaları — Sadece Form İçeriği

Her entity için Detail sayfası 20-40 satırdır. Sadece form alanlarını tanımlar:

```tsx
// pages/accounts/detail/ui/AccountDetailPage.tsx
export function AccountDetailPage() {
  return (
    <DetailPageLayout
      entityType="account"
      useEntityQuery={useAccountQuery}
      useUpsertMutation={useUpsertAccount}
      useDeleteMutation={useDeleteAccount}
      schema={accountSchema}
      fieldPermissions={useAccountFieldPermissions()}
      title={(mode, data) =>
        mode === 'new' ? 'Yeni Firma' : data?.name ?? 'Firma'
      }
      afterSaveNavigation="view"
    >
      <FormSection title="Genel Bilgiler">
        <TextField name="name" label="Firma Adı" required />
        <SelectField name="type" label="Tür" options={accountTypes} />
        <TextField name="accountNumber" label="Firma No" force="readonly" />
      </FormSection>

      <FormSection title="İletişim">
        <TextField name="email" label="E-posta" />
        <TextField name="phone" label="Telefon" />
      </FormSection>
    </DetailPageLayout>
  );
}
```

### 6.5 Jenerik Sayfa Yasağı

Tek bir `<EntityDetailPage entity="account" />` yazmaya **çalışılmaz**. Konfigürasyon tabanlı sayfa, erken soyutlamadır. Her entity'nin özel ihtiyaçları (Order'da satır editörü, Activity'de tür seçici) jenerik sayfada `if entity === 'order'` koşullarına dönüşür ve bakımı imkansızlaşır.

Doğru yaklaşım: `DetailPageLayout` ortak iskelettir, entity sayfası form içeriğini tanımlar.

---

## 7. List Page Pattern

Her entity'nin bir liste sayfası vardır. `ListPageLayout` ortak iskelet sağlar:

- Filtre bar'ı
- `DataTable` (sıralama, sayfalama, seçim)
- "Yeni Ekle" butonu
- Satır tıklama → detail sayfasına navigasyon (`/:id` — view modu)
- URL-senkronize filtreler ve sayfalama (deep-link desteği)

```tsx
// pages/accounts/list/ui/AccountsListPage.tsx
export function AccountsListPage() {
  return (
    <ListPageLayout
      entityType="account"
      useListQuery={useAccountsQuery}
      columns={accountColumns}
      filtersComponent={<AccountListFilters />}
      rowLinkTo={(row) => `/accounts/${row.id}`}
      createLinkTo="/accounts/new"
      title="Firmalar"
    />
  );
}
```

Entity-spesifik liste bileşenleri (filtre formu, özel kolonlar) `widgets/<entity>-list/` altında yaşar.

---

## 8. Form Mode Pattern

### 8.1 FormModeProvider

Mode (`new | edit | view`), field permission'ları ve iş mantığı bayraklarını alt component'lere yayan context provider:

```tsx
type FormModeContextValue = {
  mode: FormMode;
  isReadOnly: boolean;            // mode === 'view'
  isDirty: boolean;
  entityType: string;
  fieldPermissions: FieldPermissionMap;
  switchToEdit: () => void;
  cancel: () => void;
};
```

### 8.2 Mode-Aware Field Primitifleri

`shared/ui/form/fields/` altında mode-aware primitifler:

- `TextField`, `NumberField`, `SelectField`, `DateField`, `TextAreaField`, `CheckboxField`, `CurrencyField`, `EntityLookupField`, `EntityRelationTable`

Hepsi aynı kararları verir:
1. Görünürlük (permission + `hideInMode`)
2. Düzenlenebilirlik (mode + permission + `force`)
3. Zorunluluk (schema + `requiredInMode`)

Bir field **asla** sayfada `{mode === 'view' ? <span>{value}</span> : <input />}` şeklinde yazılmaz. Bu karar field primitifinin içindedir.

### 8.3 Prop Drilling Yasak

Mode prop olarak geçirilmez. `<TextField mode={mode} />` yanlıştır. Her field `useFormMode()` ile context'ten kendi okur.

### 8.4 İlişki Alanları — EntityLookupField (Varsayılan)

Bir entity'nin başka bir entity'ye ilişkisi forma girerken **varsayılan olarak `EntityLookupField`** kullanılır. Ham `SelectField` + id listesi veya elle yazılmış arama kutusu **kullanılmaz**.

- Form değeri API'nin `EntityReference` sözleşmesiyle birebir aynıdır: `{ id, entityType, name }` (`shared/types/EntityReference.ts`). DTO'dan gelen `EntityReference` doğrudan form değeridir; mapper'da ayrıca ham id'ye indirgemek gerekmez. API tarafı da ilişkileri `EntityReference` ile taşır (bkz. `Api_Architecture.md` §12.1) — iki uç aynı şekli görür.
- `EntityLookupField` mode-aware'dir (view modda etiket/Tag, edit modda arama modal'ı) ve §9 override hiyerarşisini (`force`, `hideInMode`, `requiredInMode`) destekler.
- Tek tip ilişki, çoklu tip (polimorfik) ve çoklu seçim aynı bileşenle ifade edilir. Entity-spesifik `servicePath` verilmezse referans registry üzerinden çözülür — yeni entity için ekstra endpoint gerekmez.

```tsx
// Tek tip — registry üzerinden (önerilen; yeni entity için endpoint yazmaya gerek yok)
<EntityLookupField name="account" control={form.control} entityType="Account" label="Firma" required />

// Tek tip — entity-spesifik search endpoint ile
<EntityLookupField name="primaryContact" control={form.control}
  servicePath={CrmServicePath.Contact.Search} entityType="Contact" label="Birincil Kişi" />

// Polimorfik (Activity regarding gibi) — birden çok tip
<EntityLookupField name="regarding" control={form.control} entityTypes={[
  { entityType: 'Account', label: 'Firma' },
  { entityType: 'Lead', label: 'Aday' },
]} label="İlgili Kayıt" />
```

**Çok kayıtlı ilişki** (bir entity'nin koleksiyon ilişkisi) için `EntityRelationTable` kullanılır — aynı `EntityReference` sözleşmesi, tablo sunumu.

**İstisna:** Sabit, küçük ve *entity olmayan* kümeler (enum, statü) `SelectField`'dir. `EntityLookupField` yalnız entity ilişkileri içindir.

---

## 9. Override Hiyerarşisi — Alan Bazlı Özel Durumlar

Sayfa modu **varsayılan** davranışı belirler. Özel durumlar için aşağıdaki hiyerarşi uygulanır (üstten alta, alttaki üsttekini ezer):

```
1. Sayfa Modu          (new | edit | view)            → varsayılan
2. Rol/Permission      (fieldPermissions)             → rol bazlı kısıtlama
3. Entity State        (order.status === 'closed')    → iş mantığı kısıtlaması
4. Field Override      (<TextField force="readonly">) → alan bazlı özel durum
5. Conditional Logic   (useWatch ile)                 → dinamik davranış
```

### 9.1 Seviye 1: Sayfa Modu

`FormModeProvider` sayfa modunu yayar. Varsayılan davranış buradan gelir.

### 9.2 Seviye 2: Permission Overlay

`FormModeProvider`'a `fieldPermissions` prop'u ile geçilir:

```ts
// entities/account/model/permissions.ts
export function useAccountFieldPermissions(): FieldPermissionMap {
  const user = useCurrentUser();
  return {
    creditLimit: { visible: true, editable: user.role === 'admin' },
    internalNotes: { visible: user.role === 'sales' },
    accountNumber: { visible: true, editable: false },
  };
}
```

Field primitifi hem mode'u hem permission'ı birlikte değerlendirir.

### 9.3 Seviye 3: Entity State Kısıtlamaları

Tüm form'u etkileyen iş kuralları **sayfa seviyesinde** çözülür, field seviyesinde değil:

```tsx
// pages/orders/detail/ui/OrderDetailPage.tsx
export function OrderDetailPage() {
  const urlMode = useRouteMode();
  const { id } = useParams();
  const { data: order } = useOrderQuery(id);

  // Kapalı order her zaman view moddadır
  const effectiveMode: FormMode =
    order?.status === 'closed' ? 'view' : urlMode;

  return (
    <DetailPageLayout
      modeOverride={effectiveMode}
      // ...
    >
      {effectiveMode === 'view' && urlMode === 'edit' && (
        <Banner variant="warning">
          Bu sipariş kapatıldığı için düzenlenemez.
        </Banner>
      )}
      {/* form alanları */}
    </DetailPageLayout>
  );
}
```

Formun bir **bölümü** etkileniyorsa nested `FormModeProvider` kullanılır:

```tsx
<FormModeProvider mode="view">
  <FormSection title="Geçmiş Fiyat Değişiklikleri">
    <PriceHistoryTable />
  </FormSection>
</FormModeProvider>
```

İçerideki field'lar en yakın provider'ı okur.

### 9.4 Seviye 4: Field-Level Override

Field primitifleri üç opsiyonel prop destekler:

```tsx
<TextField
  name="accountNumber"
  label="Firma No"
  force="readonly"                 // mode ne olursa olsun readonly
/>

<TextField
  name="internalNote"
  label="İç Not"
  hideInMode={['view']}            // view modda hiç render etme
/>

<TextField
  name="email"
  label="E-posta"
  requiredInMode={['edit']}        // sadece edit'te zorunlu
/>
```

**Kural:** Yeni bir özel durum için önce prop ile çözmeyi dene. Prop sayısı 5-6'yı geçtiyse abstraction sınırına yaklaşmışsın demektir; o zaman yeni bir field türü (`CalculatedField`, `SystemField`) oluştur.

### 9.5 Seviye 5: Conditional Logic

Başka alanlara bağlı dinamik davranışlar `useWatch` ile çözülür ve **sayfanın içinde** yazılır, field'ın içine gömülmez:

```tsx
function BillingAddressSection() {
  const sameAsShipping = useWatch({ name: 'sameAsShipping' });

  return (
    <FormSection title="Fatura Adresi">
      <TextField
        name="billingStreet"
        label="Cadde"
        force={sameAsShipping ? 'readonly' : undefined}
      />
    </FormSection>
  );
}
```

---

## 10. Özel Durum Alternatifleri — Hangi Aracı Ne Zaman Kullanmalı

| Durum | Araç |
|---|---|
| Tek alanın davranışı mode'dan sapıyor | Field override prop'ları (`force`, `hideInMode`, `requiredInMode`) |
| Birden fazla alan aynı koşula bağlı gizleniyor | Custom section component (`<AdminOnlySection>`) |
| Formun bir bölümü tamamen farklı modda | Nested `FormModeProvider` |
| Tüm form bir iş kuralıyla readonly | Sayfa seviyesinde `modeOverride` |
| Alan A, alan B'nin değerine bağlı | `useWatch` + sayfada koşul |
| Tamamen yeni davranış (5+ prop gerekiyor) | Yeni field türü oluştur |

**Kural:** Yeni field prop'u eklemek, yeni field türü türetmekten önce denenir. Yeni field türü, özel section component'inden önce denenir.

---

## 11. Mode Transition (Geçişler)

Mode geçişleri `DetailPageLayout` tarafından merkezi olarak yönetilir. Her entity sayfasında yeniden yazılmaz.

| Geçiş | Tetikleyici | Davranış |
|---|---|---|
| View → Edit | "Düzenle" butonu | URL `/:id/edit`'e değişir |
| Edit → View | Save başarılı | `afterSaveNavigation` prop'una göre |
| Edit → View | "İptal" butonu | Dirty ise onay sor, sonra `/:id`'ye git |
| New → View | Save başarılı | `/:newId`'ye navigate |
| Form değişti | Sayfadan çıkış girişimi | `useBlocker` ile uyarı |

`afterSaveNavigation` seçenekleri: `'view'` (varsayılan), `'edit'` (kaydet ve devam et), `'list'` (listeye dön).

---

## 12. Domain Modeli (Multi-App)

### 12.1 Activity (Platform — paylaşılan)
**Konum (frontend):** `Platform.Web/src/entities/activity/`
**Konum (backend):** `Platform.Domain.Entities.Activities`

Tek entity, discriminated union (`PhoneCall | Email | Task | Appointment`). Polimorfik regarding referansı (`RegardingEntityType: string` + `RegardingEntityId: Guid`) ile her app'in entity'sine bağlanır. Resolver registry üzerinden CRM Account'a, CodePro Supplier'a, ileride başka app'lerin entity'lerine de gösterilebilir.

### 12.2 Account & Contact (CRM)
**Konum (frontend):** `Apps/Crm/Crm.Web/src/entities/account/`, `entities/contact/`
**Konum (backend):** `Crm.Domain.Entities.Accounts`, `Crm.Domain.Entities.Contacts`

Aggregate root'lardır. Account-Contact junction (`AccountContact`) Account aggregate'inin parçası — ayrı entity klasörü açılmaz. CRM'in `accountKeys` ve `contactKeys` Crm.Web'in `shared/api/queryKeys.ts`'sinde. CodePro'da yer almazlar; CodePro tarafında bir tedarikçiye benzeyen kavram gerekirse Supplier (kendi entity'si) kullanılır.

### 12.3 Lead & Opportunity (CRM)
CRM'in satış akışı entity'leri. Lead'in `convertedAccountId` / `convertedContactId` alanları aynı CRM domain'i içinde Account/Contact'a referans verir.

### 12.4 Supplier (CodePro)
**Konum (frontend):** `Apps/CodePro/CodePro.Web/src/entities/supplier/`
**Konum (backend):** `CodePro.Domain.Entities.Suppliers`

CodePro'nun kendi tedarikçi kavramı. **CRM Account'tan inherit ETMEZ** — kendi tablosunda (`supplier`), kendi yaşam döngüsünde (`SupplierStatus`, `CompanyType`, `CompanyLegalType`, `vkn`, `mersisNo`), kurumsal iletişim ve adres alanları düz alanlar olarak. PurchaseOrder, PriceList, ProductPrice, ProductSku gibi CodePro entity'leri Supplier'a `supplierId` ile referans verir.

### 12.5 PurchaseOrder, Budget, Offer, Contract, Product, vb. (CodePro)
CodePro'nun satın alma akışı entity'leri. `entities/purchase-order/`, `entities/budget/` vb. CodePro.Web içinde.

### 12.6 Eski "Order" Örneği (deprecated)
Bu doküman tarihte CRM'de Order/OrderDetail örneği üzerinden child-entity ve aggregate kavramlarını anlatıyordu. Mevcut domain'de Order entity'si **yok**; CodePro'da `PurchaseOrder` (header) + `PurchaseOrderLine` (child) bu pattern'in canlı örneğidir. PurchaseOrderLine için ayrı entity klasörü açılmaz; `entities/purchase-order/model/types.ts` içinde birlikte tanımlanır.

### 12.7 Activity (eski tanım — referans için korundu)
Tek entity, discriminated union:

```ts
type ActivityBase = {
  id: string;
  subject: string;
  assignedTo: UserId;
  relatedTo: { entityType: 'account' | 'order'; entityId: string };
  status: 'open' | 'completed' | 'cancelled';
  dueDate: Date;
};

type PhoneCall = ActivityBase & { type: 'phoneCall'; phoneNumber: string; direction: 'inbound' | 'outbound'; duration?: number };
type Task = ActivityBase & { type: 'task'; priority: 'low' | 'medium' | 'high' };
type Appointment = ActivityBase & { type: 'appointment'; startTime: Date; endTime: Date; location?: string };
type Activity = PhoneCall | Task | Appointment;
```

- Type guard'lar: `entities/activity/model/guards.ts`
- Türe özel formlar: `features/activity-create/ui/forms/`
- Üçü de aynı reducer'ı ve aynı mutation'u paylaşır

---

## 13. Authentication

### 13.1 Login Feature

Login diğer entity'lerden farklıdır — mode kavramı yok, layout farklı (tam ekran), auth provider'ı besliyor. Detail Page Pattern **kullanılmaz**.

```
features/auth-login/
├── model/
│   ├── intent.ts            # SUBMIT_CREDENTIALS, SUBMIT_SUCCESS, SUBMIT_FAILURE
│   ├── reducer.ts
│   └── store.ts
├── api/
│   └── useLoginMutation.ts
└── ui/
    ├── LoginForm.tsx
    └── LoginErrorMessage.tsx
```

### 13.2 Login Page

```
pages/auth/login/
└── ui/
    ├── LoginPage.tsx              # auth layout'u + LoginForm
    └── LoginPageLayout.tsx        # SADECE bu sayfaya özel tam-ekran layout
```

### 13.3 AuthGuard

```
app/router/guards/AuthGuard.tsx
```

`AuthGuard`, `shared/lib/permissions.ts`'den okuduğu session'a bakar, yoksa `/login`'e yönlendirir. Tüm detail/list sayfaları bu guard'ın arkasındadır.

### 13.4 Diğer Auth Feature'ları

- `features/auth-logout/` — session temizleme + redirect
- `features/auth-forgot-password/` — şifre sıfırlama akışı
- `features/auth-change-password/` — profil içinde şifre değişimi

---

## 14. Klasör Yapısı

> Aşağıdaki yapı **referans/şablon**dur — Platform.Web'in source'u + örnek bir app'in (Crm.Web) yapısını birleştirir. Her app aynı paterny izler. CodePro.Web yapısı da paraleldir (entities/supplier, pages/suppliers, ... şeklinde).

```
PlatformSuite/
├── Platform/Platform.Web/src/   # @platform/ui — paylaşılan paket
│   ├── app/
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── AppProviders.tsx
│   │   ├── router/
│   │   │   ├── routes.tsx       # Platform.Web'in kendi rotaları (auth admin)
│   │   │   ├── paths.ts         # platform RoutePaths/Patterns (Activity, AppUser, AppRole, ...)
│   │   │   └── guards/
│   │   │       ├── AuthGuard.tsx
│   │   │       └── RoleGuard.tsx
│   │   └── i18n.config.ts       # platform namespace'leri
│
├── shared/
│   ├── ui/
│   │   ├── Button/
│   │   ├── DataTable/
│   │   ├── Modal/
│   │   ├── Drawer/
│   │   ├── Banner/
│   │   ├── EmptyState/
│   │   ├── form/
│   │   │   ├── FormModeContext.tsx
│   │   │   ├── FormModeProvider.tsx
│   │   │   ├── useFormMode.ts
│   │   │   ├── useFieldPermission.ts
│   │   │   ├── fields/
│   │   │   │   ├── TextField.tsx
│   │   │   │   ├── NumberField.tsx
│   │   │   │   ├── SelectField.tsx
│   │   │   │   ├── DateField.tsx
│   │   │   │   ├── LookupField.tsx
│   │   │   │   ├── TextAreaField.tsx
│   │   │   │   ├── CheckboxField.tsx
│   │   │   │   └── CurrencyField.tsx
│   │   │   ├── layout/
│   │   │   │   ├── FormSection.tsx
│   │   │   │   ├── FormActions.tsx
│   │   │   │   └── FormHeader.tsx
│   │   │   └── types.ts
│   │   ├── detail-page/
│   │   │   ├── DetailPageLayout.tsx
│   │   │   └── useDetailPageState.ts
│   │   └── list-page/
│   │       ├── ListPageLayout.tsx
│   │       └── useListPageState.ts
│   ├── api/
│   │   ├── httpClient.ts
│   │   ├── errorMapper.ts
│   │   └── queryKeys.ts
│   ├── lib/
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   ├── validation/
│   │   └── permissions.ts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── usePagination.ts
│   │   ├── useMediaQuery.ts
│   │   └── useRouteMode.ts
│   ├── config/
│   │   ├── env.ts
│   │   └── constants.ts
│   └── types/
│       ├── pagination.ts
│       ├── common.ts
│       └── formMode.ts
│
│   ├── entities/                # Platform-merkezli entity'ler
│   │   ├── activity/
│   │   ├── user/
│   │   ├── app-user/
│   │   ├── app-role/
│   │   ├── organization/
│   │   └── attachment/
│   ├── features/                # Auth feature'ları
│   │   ├── auth-login/
│   │   ├── auth-logout/
│   │   └── auth-forgot-password/
│   ├── pages/                   # Platform-seviyesi admin sayfaları
│   │   ├── auth/login/
│   │   ├── home/
│   │   ├── activities/
│   │   ├── organizations/
│   │   ├── users/
│   │   └── app-roles/
│   ├── widgets/
│   │   ├── app-shell/
│   │   ├── app-header/
│   │   ├── app-sidebar/
│   │   └── attachment/
│   └── index.ts                 # public barrel — DetailPageLayout, ListPageLayout, TextField, ServicePath, ... export'ları
│
└── Apps/Crm/Crm.Web/src/        # CRM app'i (örnek; CodePro.Web aynı patern)
    ├── app/
    │   ├── i18n.config.ts       # registerCrmTranslations()
    │   ├── menu/useCrmMenu.tsx
    │   └── router/
    │       ├── paths.ts         # Platform paths spread + CRM rotaları (Account/Contact/Lead/Opportunity)
    │       └── routes.tsx
    ├── shared/api/
    │   ├── queryKeys.ts         # accountKeys, contactKeys, leadKeys, opportunityKeys
    │   └── servicePaths.ts      # CrmServicePath (Lead, Opportunity)
    ├── shared/locales/enums/tr.json # CRM enum çevirileri (deep-merge platform enum'larına eklenir)
    ├── entities/
    │   ├── account/
    │   │   ├── model/
    │   │   │   ├── types.ts
    │   │   │   ├── schema.ts
    │   │   │   ├── permissions.ts
    │   │   │   └── mappers.ts
    │   │   ├── api/
    │   │   │   ├── accountDataSource.ts
    │   │   │   ├── useAccountQueries.ts
    │   │   │   └── useAccountMutations.ts
    │   │   ├── locales/tr.json
    │   │   └── ui/
    │   │       ├── AccountAvatar.tsx
    │   │       ├── AccountTypeBadge.tsx
    │   │       └── AccountLookup.tsx
    │   ├── contact/
    │   ├── lead/
    │   └── opportunity/
│
    ├── features/                # CRM-spesifik feature'lar (gerekiyorsa)
    │   ├── account-delete/
    │   └── activity-create/     # CRM'in kendi Activity-create varyantı (Activity entity Platform'da)
    │
    ├── widgets/                 # CRM-spesifik kompozit widget'lar
    │   └── account-list/
    │       └── ui/
    │           ├── AccountListFilters.tsx
    │           └── AccountListColumns.tsx
    │
    └── pages/
        ├── accounts/
        │   ├── list/
        │   │   ├── ui/AccountsListPage.tsx
        │   │   └── locales/tr.json
        │   └── detail/
        │       ├── ui/AccountDetailPage.tsx
        │       └── locales/tr.json
        ├── contacts/
        ├── leads/
        └── opportunities/
```

CodePro.Web yapısı paraleldir: `entities/{supplier,brand,product,purchase-order,...}`, `pages/{suppliers,products,purchase-orders,...}`. CodePro'da Account/Contact/Activity menü maddesi **yoktur** — CodePro CRM değil, satın alma platformudur.

---

## 15. Bağımlılık Kuralları

### İzin verilen importlar

| Katman | İmport edebilir |
|---|---|
| `app/` | tüm katmanlar (sadece giriş noktası) |
| `pages/` | widgets, features, entities, shared |
| `widgets/` | features, entities, shared |
| `features/` | entities, shared |
| `entities/` | shared (başka bir entity'yi **değil**) |
| `shared/` | yalnızca shared |

### Yasaklar

- `entities/account` → `entities/order` importu **yasak**
- `features/account-create` → `features/order-create` importu **yasak**
- Doğrudan `axios` kullanımı **yasak** — sadece `shared/api/httpClient` üzerinden
- Reducer içinde yan etki **yasak**
- Field primitifi dışında `mode === 'view'` kontrolü **yasak**
- Mode prop olarak geçirmek **yasak** (context kullan)

ESLint kuralları `eslint-plugin-boundaries` veya `dependency-cruiser` ile CI'da zorunlu kılınır.

---

## 16. Test Stratejisi

- **Unit:** Reducer, mapper, calculation, permission hook'ları — saf fonksiyonlar
- **Component:** Field primitifleri (her mode + override kombinasyonu)
- **Integration:** `DetailPageLayout` + bir entity sayfası (MSW ile API mock)
- **E2E:** Kritik akışlar (login → account oluştur → order ekle → activity kapat)

Mode ve override kombinasyonları için snapshot test'ten ziyade behavior test yazılır.

---

## 17. Adlandırma Konvansiyonları

| Öğe | Format | Örnek |
|---|---|---|
| Entity klasörü | tekil, küçük harf | `account`, `order` |
| Feature klasörü | `<entity>-<eylem>` | `account-delete`, `order-line-editor` |
| Component dosyası | PascalCase | `AccountDetailPage.tsx` |
| Hook dosyası | camelCase, `use` prefix | `useAccountQuery.ts` |
| Intent tipi | UPPER_SNAKE_CASE | `ADD_LINE`, `SUBMIT_SUCCESS` |
| Query key | hiyerarşik tuple | `['accounts', 'detail', id]` |
| Page dosyası | `<Entity><Page>Page` | `AccountDetailPage`, `AccountsListPage` |
| Section dosyası | `<Entity><Ad>Section` | `OrderLinesSection` |

---

## 18. Kaçınılması Gerekenler

- **God component:** 300+ satırlık sayfa. Section veya feature çıkar.
- **Prop drilling:** 3+ seviye prop geçişi (mode dahil). Context veya composition kullan.
- **Circular import:** İki dosyanın birbirini import etmesi. Ortak parçayı üst katmana taşı.
- **Reducer'da yan etki:** API çağrısı, `Date.now()`, navigasyon. Dışarı al.
- **Erken genelleme:** "İleride lazım olur" düşüncesiyle abstraction. İkinci kullanım gelene kadar bekle.
- **Ayrı entity açma:** Child entity veya value object için (OrderDetail gibi).
- **Jenerik Detail sayfası:** Konfigürasyondan okuyan `<EntityDetailPage entity="x" />`. Yasak.
- **Field içinde `mode === 'view'` kontrolü:** Sadece field primitiflerinin içinde olur, sayfa kodunda asla.
- **Mode'u state'te tutma:** URL tek gerçek kaynak.
- **Mode'u prop olarak geçme:** Context üzerinden yayılır.
- **İlişki için ham `SelectField` / id listesi:** Entity ilişkisi varsayılan olarak `EntityLookupField` ile bağlanır (§8.4); `SelectField` yalnız enum/statü gibi entity olmayan kümeler için.

---

## 19. Uluslararasılaştırma (i18n)

Çok uygulamalı platform için çeviri kaynakları FSD katmanlarına paralel, **hibrit** yapıda organize edilir: ortak anahtarlar `shared/` altında merkezî; entity/feature-özel anahtarlar ilgili modülün kendi `locales/` klasöründe. Tek bir `i18n.config.ts` tüm namespace'leri aggregate eder.

### 19.1 Kütüphane

- **i18next** + **react-i18next**. React 18/19 uyumlu, SSR'a hazır, namespace sistemi güçlü.
- Alternatif (formatjs, lingui) değerlendirildi; i18next'in namespace modeli FSD ile en iyi uyumu sağladı.

### 19.2 Konum ve Namespace Kuralları

| Çeviri tipi | Konum | Namespace |
|---|---|---|
| Ortak / domain'siz (buton etiketleri, form mesajları, genel hata) | `shared/locales/common/<lang>.json` | `common` |
| Enum değerleri (AccountStatus, EmailType, PhoneType, ActivityType, …) | `shared/locales/enums/<lang>.json` | `enums` |
| Entity-özel etiketler (field adları, placeholder'lar) | `entities/<entity>/locales/<lang>.json` | `entity.<entity>` |
| Feature-özel metinler (LoginForm mesajları, OrderLine editör etiketleri) | `features/<entity>-<eylem>/locales/<lang>.json` | `feature.<entity>-<eylem>` |
| Widget-özel | `widgets/<ad>/locales/<lang>.json` | `widget.<ad>` |
| Sayfa-özel (yalnızca o sayfaya ait) | `pages/<path>/locales/<lang>.json` | `page.<path>` |

**Altın kural:** Çeviri anahtarı, içeriğin *yaşadığı* katmanla aynı klasörde yaşar. İkinci bir kullanıcı gelince `shared/` veya `entity.<x>`'e promote edilir.

### 19.3 Aggregate Pattern — Multi-App i18n

i18n iki kademeli kurulur:

1. **Platform.Web/src/app/i18n.config.ts** — `@platform/ui/i18n` olarak export edilir; platform namespace'lerini (common, enums, entity.user, entity.activity, ..., feature.auth-login, page.activities-list, ...) init eder.
2. **Apps/<App>/<App>.Web/src/app/i18n.config.ts** — `register<App>Translations()` fonksiyonu ile app'in namespace'lerini ekler ve `enums` namespace'ini deep-merge ile genişletir.

**Platform** (`Platform.Web/src/app/i18n.config.ts`):

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonTr from "../shared/locales/common/tr.json";
import enumsTr from "../shared/locales/enums/tr.json";
import userTr from "../entities/user/locales/tr.json";
import activityTr from "../entities/activity/locales/tr.json";
import organizationTr from "../entities/organization/locales/tr.json";
import attachmentTr from "../entities/attachment/locales/tr.json";
import authLoginTr from "../features/auth-login/locales/tr.json";
// ...

void i18n.use(initReactI18next).init({
  lng: "tr",
  fallbackLng: "tr",
  defaultNS: "common",
  ns: ["common", "enums", "entity.user", "entity.activity", "feature.auth-login", /* ... */],
  resources: {
    tr: {
      common: commonTr,
      enums: enumsTr,
      "entity.user": userTr,
      "entity.activity": activityTr,
      "feature.auth-login": authLoginTr,
      // ...
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
```

**App** (`Apps/Crm/Crm.Web/src/app/i18n.config.ts`):

```ts
import i18n from 'i18next';

import accountEntityTr from '../entities/account/locales/tr.json';
import contactEntityTr from '../entities/contact/locales/tr.json';
import leadEntityTr from '../entities/lead/locales/tr.json';
import opportunityEntityTr from '../entities/opportunity/locales/tr.json';
import accountsListTr from '../pages/accounts/list/locales/tr.json';
import accountsDetailTr from '../pages/accounts/detail/locales/tr.json';
// ...
import crmEnumsTr from '../shared/locales/enums/tr.json';
import crmMenuTr from './menu/locales/tr.json';

/**
 * Platform i18n init'i (`@platform/ui/i18n` import'u) tamamlandıktan sonra çağrılır.
 * CRM-spesifik namespace'leri ekler ve `enums` namespace'ini deep-merge ile genişletir.
 */
export function registerCrmTranslations(): void {
  i18n.addResourceBundle('tr', 'entity.account', accountEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.contact', contactEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.lead', leadEntityTr, true, true);
  i18n.addResourceBundle('tr', 'entity.opportunity', opportunityEntityTr, true, true);
  i18n.addResourceBundle('tr', 'page.accounts-list', accountsListTr, true, true);
  i18n.addResourceBundle('tr', 'page.accounts-detail', accountsDetailTr, true, true);
  // ...

  // enums namespace Platform tarafından init edildi; üzerine CRM enum'larını deep-merge et.
  i18n.addResourceBundle('tr', 'enums', crmEnumsTr, true, false);
  i18n.addResourceBundle('tr', 'app.crm-menu', crmMenuTr, true, true);
}
```

App'in `main.tsx` veya provider'ında: önce `import '@platform/ui/i18n';` (platform init), ardından `registerCrmTranslations()` çağrılır.

CodePro.Web aynı paterni kullanır: `registerCodeProTranslations()`. Account/Contact/Lead/Opportunity namespace'leri **CRM'de**, Supplier ve diğer CodePro entity'leri **CodePro'da** kalır; cross-app namespace import yasaktır.

### 19.4 Kullanım

```tsx
// Feature kendi namespace'ini tüketir
const { t } = useTranslation('feature.auth-login');
<Button>{t('submit')}</Button>;      // → "Giriş yap"

// Ortak anahtarlar
const { t: tCommon } = useTranslation('common');
tCommon('actions.save');              // → "Kaydet"

// Enum çevirisi
const { t: tEnum } = useTranslation('enums');
tEnum(`accountStatus.${status}`);     // status = "Active" → "Aktif"

// Entity field label
const { t: tEntity } = useTranslation('entity.account');
tEntity('fields.accountName.label');  // → "Firma Adı"
```

### 19.5 Enum Çeviri Stratejisi

Tüm enum çevirileri **tek noktadan** — `shared/locales/enums/<lang>.json`:

```json
{
  "accountStatus": { "Prospect": "Potansiyel", "Active": "Aktif", "AtRisk": "Riskli" },
  "emailType": { "Work": "İş", "Personal": "Kişisel", "Other": "Diğer" },
  "phoneType": { "Mobile": "Cep", "Work": "İş", "Home": "Ev" },
  "addressType": { "Billing": "Fatura", "Shipping": "Sevkiyat", "Home": "Ev", "Work": "İş" }
}
```

Helper (`shared/lib/i18n/enum.ts`):

```ts
import { useTranslation } from 'react-i18next';

export function useEnumTranslation(enumName: string) {
  const { t } = useTranslation('enums');
  return (value: string) => t(`${enumName}.${value}`, { defaultValue: value });
}

// Kullanım
const tStatus = useEnumTranslation('accountStatus');
<Tag>{tStatus(account.status)}</Tag>
```

### 19.6 Yeni Entity/Feature Eklerken

1. **Doğru app'te** klasör aç: Account/Contact/Lead/Opportunity → Crm.Web; Supplier/PurchaseOrder → CodePro.Web; cross-app paylaşılan (Activity, AppUser) → Platform.Web.
2. `entities/<entity>/locales/tr.json` veya `pages/<sayfa>/locales/tr.json` oluştur.
3. App'in `register<App>Translations()` fonksiyonuna (Platform için `i18n.config.ts`'e) import + `addResourceBundle` satırı ekle.
4. Kod içinde `useTranslation('<namespace>')` ile tüket.

### 19.7 Yeni Dil Ekleme

1. Her locale klasöründe `<lang>.json` oluştur (örn: `shared/locales/common/en.json`, `features/auth-login/locales/en.json`).
2. `app/i18n.config.ts`'te `resources.<lang>` sözlüğünü ekle.
3. Runtime dil değişimi için `i18n.changeLanguage(lang)` — `widgets/language-switcher/` gibi bir widget'tan tetiklenir.
4. Fallback: `fallbackLng: 'tr'` — eksik anahtar TR'den gelir.

### 19.8 Anahtar İsimlendirme

- **Semantic, teknik değil:** `actions.save` ✅, `btnSave` ❌.
- **Hiyerarşik:** `fields.accountName.label`, `fields.accountName.placeholder`, `fields.accountName.required`.
- **Yatay tutarlılık:** Enum key'leri backend enum değeriyle birebir eşleşir (örn. `accountStatus.Active` — değer "Active", etiket "Aktif").

### 19.9 Yasaklar

- ❌ **Hard-coded literal:** Sayfa/feature/widget kodunda `"Giriş yap"` gibi Türkçe string.
- ❌ **Cross-namespace sızıntı:** Bir feature'ın başka feature'ın namespace'ini tüketmesi (`useTranslation('feature.order-edit')` — auth-login içinde yasak). Ortak key'ler `common`'a promote edilir.
- ❌ **Enum çevirisinin iki yerde farklı tanımı:** Sadece `shared/locales/enums/`.
- ❌ **Teknik key isimleri:** `btn1`, `text_x`, `msg42` — anlamlı semantic isim.
- ❌ **UI kit'i sayfadan import etme** (`from 'antd'`): UI wrapper'ları `shared/ui/` altında. Aynı disiplin i18n için de geçerli — erişim katmansal.

---

## 20. Karar Kaydı (ADR Başlıkları)

- **ADR-001:** MVI + FSD hibrit seçildi; saf VIPER reddedildi.
- **ADR-002:** Aggregate root + child entity tek `entities/<root>/` altında modellenir (PurchaseOrder + PurchaseOrderLine; AccountContact junction Account içinde).
- **ADR-003:** Activity tek entity, discriminated union; polimorfik regarding referansı (`RegardingEntityType: string` + `RegardingEntityId: Guid`) ile cross-app çalışır.
- **ADR-004:** State yönetimi için Zustand + useReducer; Redux eklenmedi.
- **ADR-005:** Server state için TanStack Query.
- **ADR-006:** Her entity kendi DataSource'una sahip.
- **ADR-007:** Detail sayfaları tek dosya, üç mod (`new | edit | view`); üç ayrı sayfa yazılmaz.
- **ADR-008:** Mode URL'den çıkarılır, state'te tutulmaz.
- **ADR-009:** Mode context ile yayılır, prop drilling yasak.
- **ADR-010:** `DetailPageLayout` ve `ListPageLayout` ortak iskelettir; jenerik konfigürasyon-tabanlı sayfa yasak.
- **ADR-011:** Override hiyerarşisi: Mode → Permission → Entity State → Field Override → Conditional Logic.
- **ADR-012:** Field davranışı field primitifinde kapsüllenir; sayfa kodunda `mode === 'view'` kontrolü yapılmaz.
- **ADR-013:** i18n kütüphanesi **i18next**; multi-app yapı: Platform.Web init eder, her app `register<App>Translations()` ile genişletir. Enum çevirileri Platform `shared/locales/enums/` + app `shared/locales/enums/` deep-merge.
- **ADR-014:** Frontend paylaşılan kod `@platform/ui` paketinde (`Platform.Web`); app'ler kendi entity/feature/page'lerini kendi `Apps/<App>/<App>.Web` projesinde tutar. Cross-app entity/page importu yasak.
- **ADR-015:** Account/Contact CRM domain entity'leri (`Crm.Web/src/entities/{account,contact}`); Supplier CodePro domain entity'si (`CodePro.Web/src/entities/supplier`); CRM Account ile CodePro Supplier ayrı entity'lerdir, ortak DB tablosunu paylaşmazlar.
- **ADR-016:** Polimorfik referans backend tarafında `IEntityReferenceResolver` registry pattern'ı ile çözülür; her app kendi entity'leri için resolver kaydeder. Frontend tarafında `EntityLookupField` polimorfik servicePath ile çağırır.
- **ADR-017:** Entity ilişkileri formda varsayılan olarak `EntityLookupField` (çok kayıtlı ilişkide `EntityRelationTable`) ile bağlanır; form değeri API'nin `EntityReference` sözleşmesiyle birebir aynıdır. Ham `SelectField` + id listesi yalnız enum/statü gibi entity olmayan kümeler içindir.

Yeni mimari kararlar `docs/adr/` altında numaralı dosyalar olarak saklanır.

---

*Bu doküman canlıdır. Değişiklikler PR ile tartışılır, ekip onayıyla güncellenir.*
