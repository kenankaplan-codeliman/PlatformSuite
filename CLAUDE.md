# Proje: PlatformSuite (Çoklu Uygulama Monorepo)

**Mimari (Frontend):** MVI + Feature-Sliced Design — tam doküman: `docs/Client_Architecture.md`
**Mimari (API):** Clean Architecture + MediatR/CQRS + Result<T> — tam doküman: `docs/Api_Architecture.md`

Yeni bir sayfa, feature, entity, endpoint veya component önermeden önce ilgili dokümanın bölümünü oku. Yeni bir entity'i hangi katmanda yer alacağına karar vermeden önce **Multi-App Yapısı** bölümünü oku.

---

## Multi-App Yapısı

Repo iki seviye barındırır: paylaşılan **Platform** kütüphane projeleri ve uygulamaya özgü **Apps** projeleri.

```
PlatformSuite/
├── Platform/                       # Paylaşılan altyapı (kütüphane)
│   ├── Platform.Domain/            # Identity, Activity, Attachment, ortak interface'ler
│   ├── Platform.Application/       # Activity feature'ları, IApplicationDbContext, IEntityReferenceResolver
│   ├── Platform.Infrastructure/    # PlatformDbContext (abstract), referans/identity repository'leri
│   ├── Platform.Api/               # AddPlatformApi<TDbContext> + UsePlatformPipeline (host orkestrasyonu)
│   └── Platform.Web/               # @platform/ui — paylaşılan React component/hook/types
├── Apps/
│   ├── Crm/
│   │   ├── Crm.Domain/             # Account, Contact, Lead, Opportunity
│   │   ├── Crm.Application/        # Account/Contact/Lead/Opportunity feature'ları
│   │   ├── Crm.Infrastructure/     # CrmDbContext, CRM repository'leri, resolver'ları + Data/Scripts/ (DbUp SQL migrations)
│   │   ├── Crm.Api/                # AccountController, ContactController, LeadController, OpportunityController
│   │   └── Crm.Web/                # CRM React app'i (Account/Contact/Lead/Opportunity sayfaları)
│   └── CodePro/
│       ├── CodePro.Domain/         # Supplier, PurchaseOrder, Budget, Offer, Contract, Product, ...
│       ├── CodePro.Application/    # CodePro feature'ları
│       ├── CodePro.Infrastructure/ # CodeProDbContext, repository'leri/resolver'ları + Data/Scripts/ (DbUp SQL migrations)
│       ├── CodePro.Api/            # SupplierController, PurchaseOrderController, ...
│       └── CodePro.Web/            # CodePro React app'i (Supplier + satın alma sayfaları)
```

**Temel kural:** `Platform/` içindeki her şey **paylaşılan altyapı**. Bir entity hangi uygulamanın iş kavramıysa o uygulamanın klasörüne yer alır; Platform'a ancak gerçekten cross-cutting (Activity, Identity, Attachment) ise konur.

### Yeni entity nereye gider?

| Soru | Cevap |
|---|---|
| Birden fazla uygulamada aynı semantikle kullanılıyor mu? (User, Activity, Attachment) | `Platform.Domain` |
| Tek bir uygulamanın iş kavramı mı? (Account → CRM, Supplier → CodePro) | İlgili `Apps/<App>/<App>.Domain` |
| CRM Account'a benzeyen bir tedarikçi gerekli — aynı tablo mu? | **Hayır.** CodePro'nun kendi `Supplier` entity'si olur (Account'tan inherit ETMEZ). |

---

## Teknoloji Stack

### Backend
- .NET 10 + ASP.NET Core
- EF Core 10 + PostgreSQL (Npgsql)
- **MediatR** — CQRS request/response + pipeline behaviors
- **FluentValidation** — input validation
- **Mapster** — entity ↔ DTO mapping
- **Serilog** + Elasticsearch, JWT + custom `PrivilegeAuthorize`

### Frontend
- React 19 + TypeScript (strict mode)
- TanStack Query (server state)
- react-hook-form + zod (form + validation)
- Zustand + useReducer (client state)
- React Router
- Axios (yalnızca `@platform/ui`'dan gelen `httpClient` üzerinden)

---

## Frontend Katman Yapısı (her .Web app'i için)

```
app → pages → widgets → features → entities → shared
```

Bağımlılık **yalnızca yukarıdan aşağıya** akar. Ters import yasaktır.

| Katman | İmport edebilir |
|---|---|
| `app/` | tüm katmanlar (sadece giriş noktası) |
| `pages/` | widgets, features, entities, shared |
| `widgets/` | features, entities, shared |
| `features/` | entities, shared |
| `entities/` | yalnızca shared |
| `shared/` | yalnızca shared |

`@platform/ui` paketi Crm.Web ve CodePro.Web tarafından "shared" gibi tüketilir; Platform.Web'in kendi shared'ı `@platform/ui`'ın source'udur.

### Yasaklar

- `entities/<x>` → `entities/<y>` importu **yasak**
- `features/*` → başka bir `features/*` importu **yasak** (kardeştirler)
- Doğrudan `axios` kullanımı **yasak** — sadece `@platform/ui`'dan gelen `httpClient`
- Reducer içinde yan etki **yasak**
- Field primitifi dışında `mode === 'view'` kontrolü **yasak**
- Mode prop olarak geçirmek **yasak** (context kullan)
- Jenerik `<EntityDetailPage entity="x" />` **yasak**
- Apps/<App>.Web'de **başka bir app'in entity'sini import etmek yasak** (Crm.Web → CodePro entity, CodePro.Web → Crm entity)

---

## Component Konumlandırma Kuralı

| Parça nasıl? | Konum |
|---|---|
| Domain bilmiyor, generic (Button, TextField) | `Platform.Web/src/shared/ui/` (`@platform/ui` export'u) |
| Tek entity'ye ait basit görsel (Avatar, Badge) | `<App>.Web/src/entities/<x>/ui/` |
| Kullanıcı niyeti temsil ediyor (form, dialog) | `<App>.Web/src/features/<entity>-<eylem>/ui/` |
| Birden fazla sayfada kullanılan kompozisyon | `<App>.Web/src/widgets/<ad>/ui/` |
| Sadece tek sayfada kullanılıyor | `<App>.Web/src/pages/<sayfa>/ui/` |
| Birden fazla app'in tüketeceği layout/primitive | `Platform.Web/src/shared/ui/` ve `index.ts` export listesine ekle |
| Editable satır koleksiyonu (line items) | `@platform/ui`'dan `TableField` + kullanım yerinde column array. Per-entity widget AÇMA; Email/Phone gibi çok-tüketicili durumlarda thin wrapper kabul; tek-tüketicili tablolar (Opportunity products) sayfa içinde inline. |

**Altın kural:** İkinci sayfada kullanılana kadar `pages/` dışına taşıma. İkinci app'te kullanılana kadar `Platform.Web` (`@platform/ui`)'a promote etme. Erken soyutlama yapma.

---

## Detail Page Pattern — KRİTİK

Her entity için **TEK** Detail sayfası vardır. Üç moda hizmet eder: `new`, `edit`, `view`.

### Route Şeması (tüm entity'ler için aynı)

```
/<entity>                 → liste
/<entity>/new             → yeni kayıt (mode: 'new')
/<entity>/:id             → görüntüleme (mode: 'view')
/<entity>/:id/edit        → düzenleme (mode: 'edit')
```

### Mode Detection

Mode **URL'den** çıkarılır, state'te tutulmaz. `@platform/ui`'dan gelen `useRouteMode` kullanılır.

### DetailPageLayout Kullanımı

Tüm Detail sayfaları `@platform/ui`'dan gelen `DetailPageLayout` kullanır. Layout şunları üstlenir:
- Mode detection (+ `modeOverride` desteği)
- Veri fetch (mode !== 'new' için)
- Form instance (react-hook-form + zod)
- `reset` ile defaultValues senkronu
- Loading/error state
- `FormModeProvider` + `FormProvider` sarmalama
- Save/Cancel/Delete + navigasyon
- Dirty guard

### Entity Detail Sayfası — 20-40 satır

```tsx
// Apps/Crm/Crm.Web/src/pages/accounts/detail/ui/AccountDetailPage.tsx
import { DetailPageLayout, FormSection, TextField } from "@platform/ui";
import { useAccountQuery } from "../../../../entities/account/api/useAccountQueries";
import { useUpsertAccount, useDeleteAccount } from "../../../../entities/account/api/useAccountMutations";
import { accountSchema } from "../../../../entities/account/model/schema";

export function AccountDetailPage() {
  return (
    <DetailPageLayout
      entityType="account"
      useEntityQuery={useAccountQuery}
      useUpsertMutation={useUpsertAccount}
      useDeleteMutation={useDeleteAccount}
      schema={accountSchema}
      title={(mode, data) => mode === 'new' ? 'Yeni Firma' : data?.accountName ?? 'Firma'}
      afterSaveNavigation="view"
    >
      <FormSection title="Genel Bilgiler">
        <TextField name="accountName" label="Firma Adı" required />
        <TextField name="accountNumber" label="Firma No" force="readonly" />
      </FormSection>
    </DetailPageLayout>
  );
}
```

---

## List Page Pattern

Tüm liste sayfaları `@platform/ui`'dan gelen `ListPageLayout` kullanır. Layout: filtre bar, DataTable, "Yeni Ekle", URL-senkronize filtre/sayfalama, satır → detail navigasyonu.

Entity-spesifik filtreler ve kolonlar `<App>.Web/src/widgets/<entity>-list/` altında yaşar.

---

## Form Mode Pattern — KRİTİK

### FormModeProvider

Mode + field permissions + dirty state'i context ile yayar. Tüm field'lar `useFormMode()` ile okur.

### Mode-Aware Field Primitifleri

`@platform/ui`'dan: `TextField`, `NumberField`, `SelectField`, `DateField`, `TextAreaField`, `CheckboxField`, `CurrencyField`, `EntityLookupField`, `EntityRelationTable`.

Her field üç karar verir: **Görünürlük**, **Düzenlenebilirlik**, **Zorunluluk**.

**YASAK:** Sayfa kodunda `{mode === 'view' ? <span>{value}</span> : <input />}` yazmak. Bu karar field primitifinin içindedir.

**YASAK:** `<TextField mode={mode} />`. Mode prop olarak geçilmez, context'ten okunur.

---

## Override Hiyerarşisi — Özel Durumlar

Sayfa modu varsayılanı belirler. Özel durumlar için hiyerarşi (üst, alttakini ezmez; alttaki üsttekini ezer):

```
1. Sayfa Modu          (new | edit | view)            → varsayılan
2. Rol/Permission      (fieldPermissions)             → rol bazlı kısıtlama
3. Entity State        (order.status === 'closed')    → iş mantığı
4. Field Override      (<TextField force="readonly">) → alan bazlı
5. Conditional Logic   (useWatch)                      → dinamik
```

### Seviye 2: Permission

```ts
// Apps/Crm/Crm.Web/src/entities/account/model/permissions.ts
export function useAccountFieldPermissions(): FieldPermissionMap {
  const user = useCurrentUser();
  return {
    creditLimit: { visible: true, editable: user.role === 'admin' },
    accountNumber: { visible: true, editable: false },
  };
}
```

### Seviye 3: Entity State (Tüm Formu Etkiler)

Sayfa seviyesinde `modeOverride` ile çözülür:

```tsx
const effectiveMode = order?.status === 'closed' ? 'view' : urlMode;
<DetailPageLayout modeOverride={effectiveMode} ...>
```

Form'un bir bölümü için nested `FormModeProvider` kullanılır.

### Seviye 4: Field-Level Override

```tsx
<TextField name="accountNumber" force="readonly" />
<TextField name="internalNote" hideInMode={['view']} />
<TextField name="email" requiredInMode={['edit']} />
```

### Seviye 5: Conditional Logic

`useWatch` ile sayfa içinde yazılır, field içine gömülmez.

---

## Özel Durum Araç Seçimi

| Durum | Araç |
|---|---|
| Tek alan farklı davranıyor | Field override prop'u (`force`, `hideInMode`, `requiredInMode`) |
| Birden fazla alan aynı koşula bağlı | Custom section component |
| Form bölümü tamamen farklı modda | Nested `FormModeProvider` |
| Tüm form iş kuralıyla readonly | Sayfa seviyesinde `modeOverride` |
| Alan A, alan B'ye bağlı | `useWatch` + sayfada koşul |
| 5+ prop gerekti | Yeni field türü oluştur (`CalculatedField`) |

**Sıra:** Önce prop. Sonra custom section/nested provider. En son yeni field türü.

---

## Mode Transition Kuralları

| Geçiş | Davranış |
|---|---|
| View → Edit | URL `/:id/edit`'e değişir |
| Edit → View (Save) | `afterSaveNavigation` prop'una göre |
| Edit → View (Cancel) | Dirty ise onay, sonra `/:id` |
| New → View (Save) | `/:newId`'ye navigate |
| Sayfadan çıkış (dirty) | `useBlocker` ile uyarı |

---

## MVI Akışı

```
User Action → Intent → Reducer → State → View
                ↑                           │
                └───────────────────────────┘
```

### Intent (UPPER_SNAKE_CASE, discriminated union)

```ts
type OrderLineIntent =
  | { type: 'ADD_LINE'; productId: string }
  | { type: 'REMOVE_LINE'; lineId: string }
  | { type: 'UPDATE_QUANTITY'; lineId: string; quantity: number };
```

### Reducer — Saf

`(state, intent) => state`. Yan etki yok.

### State Yönetimi

- Küçük feature: `useReducer`
- Paylaşılan: Zustand
- Server state: TanStack Query (ayrı tutulur)

### Yan Etkiler

API reducer içinde değil, mutation hook'unda. Sonuç intent olarak geri beslenir.

---

## Veri Katmanı

### DataSource

HTTP çağrıları **yalnızca** `entities/<x>/api/` içinde. DTO → domain mapping `mappers.ts`'te. `httpClient` ve `ServicePath` `@platform/ui`'dan gelir; her app kendi `shared/api/servicePaths.ts` içinde uygulamaya özgü route'ları toplar (örn. `CrmServicePath.Lead.List`, `CodeProServicePath.Supplier.List`).

### Query Keys — Merkezi Fabrika

Her app kendi `shared/api/queryKeys.ts`'ini barındırır. Account/Contact key'leri **CRM**'in queryKeys'inde, Supplier key'i **CodePro**'nun queryKeys'inde:

```ts
// Apps/Crm/Crm.Web/src/shared/api/queryKeys.ts
export const accountKeys = { all: ['account'] as const, /* ... */ };
export const contactKeys = { all: ['contact'] as const, /* ... */ };
export const leadKeys    = { all: ['lead'] as const, /* ... */ };

// Apps/CodePro/CodePro.Web/src/shared/api/queryKeys.ts
export const supplierKeys = makeKeys('supplier');
```

Activity/auth gibi platform-seviyesi key'ler `@platform/ui`'dan gelir.

### Cache Invalidation

- Create/Update/Delete → ilgili entity'nin `lists()` ve `detail(id)`
- Çapraz etkiler → `onSuccess` içinde açıkça
- Default staleTime: 30sn; referans veriler: 5dk

---

## Domain Kuralları

### Activity (Platform)
**Konum:** `Platform.Domain.Entities.Activities` — abstract `ActivityBase` + `PhoneCallActivity` / `EmailActivity` / `TaskActivity` / `AppointmentActivity`.

Tek entity, discriminated union. Polimorfik regarding referansı: `RegardingEntityType` (string) + `RegardingEntityId` (Guid) → istediği app'in herhangi bir entity'sine bağlanır.

- Type guard'lar / türe özel formlar: ilgili `<App>.Web/src/features/activity-create/ui/forms/` (henüz CRM'de yok, ileride).
- Aynı reducer + aynı mutation; tür ayrımı string anahtar üzerinden.

### Account & Contact (CRM)
**Konum:** `Crm.Domain.Entities.Accounts`, `Crm.Domain.Entities.Contacts`.

Aggregate root'lardır; CodePro'da yer almazlar. CRM'in `accountKeys`/`contactKeys`'i `Crm.Web` shared'ında. Account-Contact junction (`AccountContact`) Account aggregate'inin parçası, ayrı entity klasörü açılmaz.

### Supplier (CodePro)
**Konum:** `CodePro.Domain.Entities.Suppliers`.

CodePro'nun kendi tedarikçi kavramı; **Account'tan inherit ETMEZ**. Kendi `supplier` tablosunda yaşar, kendi yaşam döngüsüne sahiptir (SupplierStatus, CompanyType, CompanyLegalType, vkn, mersisNo, kurumsal iletişim ve adres alanları). Çoklu iletişim kişisi gerekirse ileride ayrı `SupplierContact` eklenir; şimdilik düz alanlar (`ContactPersonName/Email/Phone`).

### Lead, Opportunity (CRM)
CRM'in satış akışı entity'leri. Lead'in `ConvertedAccountId` ve `ConvertedContactId` alanları aynı domain içinde Account/Contact'a referans verir.

### PurchaseOrder, Budget, Offer, Contract, Product, vb. (CodePro)
CodePro'nun satın alma akışı entity'leri. `Supplier` ile `SupplierId` üzerinden ilişkilenir.

### Yeni entity açmadan önce sor
- Hangi app'in iş kavramı? Birden fazla app'te aynı semantikle yer alacaksa Platform; tek app'e özelse o app'in domain'i.
- Kendi endpoint'i var mı? Kendi yaşam döngüsü var mı? Aggregate root mü? Değilse parent içinde child olarak yaşasın (AccountContact gibi).

---

## EntityReferenceResolver Pattern (Polimorfik Referans Çözümleme)

Activity'nin `RegardingEntityType` polimorfik referansı + EntityLookupField gibi cross-app lookup'lar `IEntityReferenceResolver` registry pattern'ı üzerinden çözülür.

```csharp
// Platform.Application/Common/References/IEntityReferenceResolver.cs
public interface IEntityReferenceResolver
{
    string EntityType { get; }
    EntityReference GetReference(Guid id);
    EntityReferenceList LookupReference(string? searchText, PaginationInfo paginationInfo);
}
```

- Platform yalnız `UserReferenceResolver`'ı kayıt eder (`Platform.Infrastructure/References/`).
- CRM, `AccountReferenceResolver` ve `ContactReferenceResolver`'ı `Crm.Infrastructure/References/` altına yazar; `Crm.Infrastructure.DependencyInjection`'da `services.AddScoped<IEntityReferenceResolver, AccountReferenceResolver>()` ile kayıt eder.
- CodePro, `SupplierReferenceResolver`'ı (ileride PurchaseOrderReferenceResolver, BudgetReferenceResolver vb.) aynı şekilde `CodePro.Infrastructure/References/` altına yazar ve kayıt eder.
- `ReferenceRepository` (Platform) registry'ye delegasyon yapar; bilinmeyen tip için `EntityReference { Id, Name=entityType }` yer tutucu döner.

**Yeni bir entity'yi Activity regarding zincirine eklemek için:** entity'nin app'inin Infrastructure projesine `<Entity>ReferenceResolver` ekle, `IEntityReferenceResolver` implemente et, `AddScoped` ile DI'ya kayıt et. Platform veya başka bir app'e dokunmaya gerek yok.

---

## Authentication

Login Detail Page Pattern kullanmaz (mode kavramı yok, tam ekran layout). `@platform/ui`'dan `LoginPage` export'u Crm.Web ve CodePro.Web'in router'ında kullanılır. Auth feature'ları (`auth-login`, `auth-logout`, `auth-forgot-password`, `auth-change-password`) Platform.Web içinde tanımlı.

```
Platform.Web/src/
├── features/auth-login/
│   ├── model/     # SUBMIT_CREDENTIALS, SUBMIT_SUCCESS, SUBMIT_FAILURE
│   ├── api/useLoginMutation.ts
│   └── ui/LoginForm.tsx
├── pages/auth/login/ui/
│   ├── LoginPage.tsx
│   └── LoginPageLayout.tsx    # tam ekran, sadece bu sayfaya özel
└── app/router/guards/AuthGuard.tsx
```

---

## Feature Şablonu

### Backend
```
<App>.Application/Features/<Entity>/
├── Commands/<Action>/        # <Action>Command.cs + Handler.cs + Validator.cs
├── Queries/<Action>/          # <Action>Query.cs + Handler.cs
├── Dtos/                      # <Entity>DetailItem, ListItem, ListFilter
└── <Entity>Errors.cs          # static Error sınıfı
```

### Frontend
```
<App>.Web/src/features/<entity>-<eylem>/
├── model/
│   ├── intent.ts          # discriminated union
│   ├── reducer.ts         # saf (state, intent) => state
│   └── store.ts           # opsiyonel (Zustand)
├── api/
│   └── use<Eylem><Entity>.ts
└── ui/
    └── <Eylem><Entity>Form.tsx
```

---

## Entity Şablonu

### Backend
```
<App>.Domain/Entities/<Entity>s/
├── <Entity>.cs            # Aggregate root + child entity'ler aynı klasörde
└── <Entity>Email.cs ...   # value object/child (gerekiyorsa)

<App>.Infrastructure/Data/Configurations/<Entity>s/
├── <Entity>Configuration.cs
└── ...
```

### Frontend
```
<App>.Web/src/entities/<entity>/
├── model/
│   ├── types.ts           # TypeScript tipleri
│   ├── schema.ts          # zod şemaları
│   ├── guards.ts          # (polimorfik ise)
│   ├── calculations.ts    # (gerekirse)
│   ├── permissions.ts     # useXFieldPermissions
│   └── mappers.ts         # DTO ↔ domain
├── api/
│   ├── <entity>DataSource.ts
│   ├── use<Entity>Queries.ts
│   └── use<Entity>Mutations.ts
└── ui/
    ├── <Entity>Avatar.tsx
    ├── <Entity>Badge.tsx
    └── <Entity>Lookup.tsx
```

---

## Page Şablonu

### Detail Page

```
<App>.Web/src/pages/<entity>/detail/
├── ui/<Entity>DetailPage.tsx      # DetailPageLayout + form alanları (20-40 satır)
└── sections/
    ├── <Entity>InfoSection.tsx    # SADECE bu sayfaya özel büyük bölümler
    └── <Entity>OtherSection.tsx
```

### List Page

```
<App>.Web/src/pages/<entity>/list/
└── ui/<Entities>ListPage.tsx      # ListPageLayout
```

---

## Adlandırma

| Öğe | Format | Örnek |
|---|---|---|
| Domain proje | `<App>.Domain` | `Crm.Domain`, `CodePro.Domain` |
| Entity klasörü | tekil, küçük harf | `account`, `supplier`, `lead` |
| Feature klasörü | `<entity>-<eylem>` | `account-delete`, `order-line-editor` |
| Component | PascalCase | `AccountDetailPage.tsx`, `SupplierDetailPage.tsx` |
| Hook | camelCase + `use` | `useAccountQuery.ts`, `useSupplierMutations.ts` |
| Intent | UPPER_SNAKE_CASE | `ADD_LINE` |
| Query key | hiyerarşik tuple | `['account', 'detail', id]`, `['supplier', 'list', filters]` |
| Page | `<Entity><Page>Page` | `AccountDetailPage`, `SuppliersListPage` |
| Section | `<Entity><Ad>Section` | `OrderLinesSection` |

---

## Referans Örnekler (Bu stilde yaz)

Claude bu yollara bakarak yeni kodları aynı stilde üretir.

### CRM
- **Entity:** `Apps/Crm/Crm.Web/src/entities/account/`, `Apps/Crm/Crm.Web/src/entities/lead/`
- **Detail Page:** `Apps/Crm/Crm.Web/src/pages/accounts/detail/ui/AccountDetailPage.tsx`
- **List Page:** `Apps/Crm/Crm.Web/src/pages/accounts/list/ui/AccountsListPage.tsx`
- **DataSource:** `Apps/Crm/Crm.Web/src/entities/account/api/accountDataSource.ts`
- **Backend feature:** `Apps/Crm/Crm.Application/Features/Accounts/`
- **Repository:** `Apps/Crm/Crm.Infrastructure/Repositories/AccountRepository.cs`
- **Resolver:** `Apps/Crm/Crm.Infrastructure/References/AccountReferenceResolver.cs`

### CodePro
- **Entity:** `Apps/CodePro/CodePro.Web/src/entities/supplier/`
- **Detail Page:** `Apps/CodePro/CodePro.Web/src/pages/suppliers/detail/ui/SupplierDetailPage.tsx`
- **List Page:** `Apps/CodePro/CodePro.Web/src/pages/suppliers/list/ui/SuppliersListPage.tsx`
- **Backend feature:** `Apps/CodePro/CodePro.Application/Features/Suppliers/`
- **Repository:** `Apps/CodePro/CodePro.Infrastructure/Repositories/SupplierRepository.cs`
- **Resolver:** `Apps/CodePro/CodePro.Infrastructure/References/SupplierReferenceResolver.cs`

### Platform (paylaşılan)
- **Field primitifi:** `Platform/Platform.Web/src/shared/ui/form/fields/TextField.tsx`
- **Layout:** `Platform/Platform.Web/src/shared/ui/detail-page/DetailPageLayout.tsx`
- **Resolver registry:** `Platform/Platform.Infrastructure/References/EntityReferenceResolverRegistry.cs`
- **Activity entity:** `Platform/Platform.Domain/Entities/Activities/ActivityBase.cs`

---

## Kaçınılması Gerekenler

- **God component:** 300+ satırlık sayfa → section/feature çıkar
- **Prop drilling:** 3+ seviye → context veya composition
- **Circular import:** ortak parçayı üst katmana taşı
- **Reducer'da yan etki:** API çağrısı, `Date.now()`, navigasyon → dışarı al
- **Erken genelleme:** ikinci kullanım gelene kadar bekle
- **Ayrı entity açma:** child entity/value object için (AccountContact)
- **Jenerik Detail sayfası:** `<EntityDetailPage entity="x" />` yasak
- **Field dışında `mode === 'view'` kontrolü:** sadece field primitiflerinde
- **Mode'u state'te tutma:** URL tek kaynak
- **Mode prop'u:** context üzerinden yayılır
- **Cross-app entity import:** Crm.Web CodePro entity'si import edemez (ya da tersi). Lookup gerekiyorsa `EntityLookupField` + `servicePath` kullanılır (HTTP üzerinden).
- **Platform.Web'de uygulamaya özgü sayfa:** Account/Contact UI Platform.Web'de yok. Platform.Web yalnız auth/user/org/role admin'i için.

---

## Claude İçin Frontend Çalışma Talimatları

Kod yazarken veya önerirken:

1. **Önce uygulamayı belirle.** Bu entity hangi app'in iş kavramı? Crm/CodePro/Platform — yer ona göre belirlenir.
2. **Konumu belirle.** "Component Konumlandırma Kuralı" tablosunu kullan.
3. **Bağımlılık yönünü kontrol et.** İmport ettiğin modül bu katmandan erişilebilir mi? Cross-app import etmediğine emin ol.
4. **Detail Page için `DetailPageLayout` kullan** (`@platform/ui`'dan). Sıfırdan form container yazma.
5. **Field seçimi:** Önce `@platform/ui` field'larından seç. Override gerekirse prop ekle. Yeni field türü son çare.
6. **Mode kararları:**
   - Varsayılan mode → `FormModeProvider` yayar
   - Tüm form readonly olmalı → `modeOverride` (sayfa seviyesinde)
   - Bir bölüm readonly → nested `FormModeProvider`
   - Tek alan farklı → field override prop'u
   - Dinamik (başka alana bağlı) → `useWatch` + sayfada koşul
7. **Şablonu uygula.** Yeni feature/entity için şablonu birebir takip et.
8. **Referans örneklere bak.** Mevcut entity/feature'ı oku, aynı stilde yaz.
9. **MVI'yı bozma.** Yan etki reducer dışında.
10. **Query key fabrikasını güncelle.** İnline key yazma — app'in `shared/api/queryKeys.ts`'ine ekle.
11. **URL-first.** Mode URL'den, filtreler URL'den, sayfalama URL'den. State'te tutma.

Kod önerilerinde değişikliğin hangi katmanı/app'i etkilediğini kısaca belirt. Örnek: *"Bu değişiklik `Apps/Crm/Crm.Web/features/account-delete/` içinde; `Platform.Web` etkilenmiyor."*

Belirsizlikte sor:
- Yeni entity hangi app'e ait? (Multi-app yapısında karar ön koşul.)
- Mevcut bir aggregate'in parçası mı, yeni aggregate mi?
- Bu component widget mi, sayfaya mı özel, yoksa platform-wide mi?
- Override'ı hangi seviyede çözmeli?

---

# API Mimarisi

**Tam doküman:** `docs/Api_Architecture.md` — yeni bir endpoint, command, query, validator veya handler önermeden önce ilgili bölümü oku.

## Katman Yapısı (her app için aynı paterny)

```
<App>.Api → <App>.Application → <App>.Domain ← <App>.Infrastructure
                  ↓                  ↓                 ↓
             Platform.Application   Platform.Domain   Platform.Infrastructure
```

| Katman | İmport edebildiği |
|---|---|
| `Platform.Api` | Platform.Application, Platform.Domain |
| `Platform.Application` | Platform.Domain |
| `Platform.Domain` | — (hiçbir proje) |
| `Platform.Infrastructure` | Platform.Application, Platform.Domain |
| `<App>.Api` | Platform.Api, <App>.Application, <App>.Domain |
| `<App>.Application` | Platform.Application, <App>.Domain |
| `<App>.Domain` | Platform.Domain |
| `<App>.Infrastructure` | Platform.Infrastructure, <App>.Application, <App>.Domain |

### DbContext Hiyerarşisi

```
PlatformDbContext (abstract, Platform.Infrastructure)  →  IApplicationDbContext (Platform.Application)
       ↑                                                       ↑
CrmDbContext (Crm.Infrastructure)                       ICrmDbContext (Crm.Application)
       ↑                                                       ↑
CodeProDbContext (CodePro.Infrastructure)               ICodeProDbContext (CodePro.Application)
```

`IApplicationDbContext` yalnız platform-merkezli DbSet'leri (Identity, Activity, Attachment) expose eder. App'e özgü DbSet'ler (`Account`, `Contact`, `Lead`, `Opportunity` → `ICrmDbContext`; `Supplier`, `PurchaseOrder` vb. → `ICodeProDbContext`) alt sözleşmelerde tanımlanır.

### Yasaklar

- `<App>.Api` → `Platform.Infrastructure` veya `<App>.Infrastructure` importu **yasak** (DbContext dahil). Sadece DI kompozisyon kökünde bağlanır.
- `<App>.Application` → herhangi bir Infrastructure tip importu **yasak**. Application interface tanımlar, Infrastructure implement eder.
- `Platform.Domain` ve `<App>.Domain` → başka hiçbir proje ve NuGet bağımlılığı yok (Domain hariç).
- **Cross-app domain import yasak**: `CodePro.Domain` `Crm.Domain.Entities.Accounts.Account`'ı import edemez. CRM Account'ı CodePro'da gerekirse polimorfik `EntityReference` kullan.
- Controller'da `DbContext` / repository / handler inject etmek **yasak**. Her şey `ISender.Send(...)` üzerinden.
- Handler'da `throw new BusinessException(...)` **yasak**. İş kuralı ihlali `Result.Failure(<Entity>Errors.<Reason>)` ile.
- Query handler'da repository kullanmak **yasak**. Read path `IApplicationDbContext` / `ICrmDbContext` / `ICodeProDbContext` + `.ProjectToType<T>()`.
- Manuel mapping (`entity.ToDto()` elle yazılmış) **yasak**. Mapster + `MappingConfig` / `<App>MappingConfig` kullan.
- Controller'da iş mantığı, `if` dalları, exception yakalama **yasak**. Controller method'u tek satır.

## Feature Şablonu

```
<App>.Application/Features/<Entity>/
├── Commands/<Action>/        # <Action>Command.cs + Handler.cs + Validator.cs
├── Queries/<Action>/          # <Action>Query.cs + Handler.cs
├── Dtos/                      # <Entity>DetailItem, ListItem, ListFilter
└── <Entity>Errors.cs          # static Error sınıfı
```

## Kritik Kurallar

1. **Command vs Query ayır.** Yazma → `ICommand<T> : IRequest<Result<T>>`; okuma → `IQuery<T> : IRequest<Result<T>>`. Aynı sınıf iki iş yapmaz.
2. **Handler Result döner, exception fırlatmaz.** İş kuralı ihlali → `Result.Failure(<Entity>Errors.<Reason>)`. Exception sadece beklenmedik hatalar için.
3. **Validation katmanlı.**
   - Input (format/zorunluluk/range, state-less) → FluentValidation → `ValidationBehavior`
   - Business rule (DB/state gerektirir, "toplam < 0", "kapalı order", duplicate check) → handler içinde `Result.Failure`
   - Karmaşık domain kuralı → entity metodu (`Opportunity.Recalculate() → Result`)
   - `MustAsync` + repo ile validator içinde DB sorgulama **yasak** (o bir business rule)
4. **Query path = uygun DbContext interface'i + projection.** App-spesifik query handler `ICrmDbContext` / `ICodeProDbContext` kullanır (Account/Supplier oradadır); platform-wide query (Activity) `IApplicationDbContext`.
5. **Command path = repository + UnitOfWork.** `SaveChangesAsync` / `CommitTransaction` çağırma — `TransactionBehavior` sarar. `ICommand` marker'ı transaction tetikler.
6. **Mapping sadece Mapster.** Platform mapping'leri `MappingConfig.cs`, app-spesifik mapping'ler `<App>MappingConfig.cs` (CrmMappingConfig, CodeProMappingConfig). App'in `DependencyInjection.cs`'i `<App>MappingConfig.Register(GlobalSettings)` çağırır.
7. **Controller tek satır.** `(await _sender.Send(request, ct)).ToActionResult()`. `ISender`'dan başka dependency inject edilmez.
8. **Tüm endpoint POST.** Route lowercase kebab-case: `api/<entity>/<action>` (örn: `api/account/set-state`). Method adı `<Action>Async` (ListAsync, CreateAsync).
9. **Error response = RFC 7807 ProblemDetails.** `Result.Failure` → `ErrorType`'a göre 400/404/409/403/500. Validation için `ValidationProblemDetails`. Custom envelope yazma.
10. **Privilege koruması zorunlu.** Her controller method'unda `[PrivilegeAuthorize(...)]`. Privilege kodu app'in `Authorization` klasöründe: Platform `PrivilegeCodes` (User/Activity/Org/Role/Attachment), Crm `CrmPrivilegeCodes` (Account/Contact/Lead/Opportunity), CodePro `CodeProPrivilegeCodes` (Supplier/PurchaseOrder/Budget/Offer/Contract/...).
11. **Polimorfik referans = registry.** Activity regarding zincirine yeni entity sokmak için `IEntityReferenceResolver` implement et ve app'in Infrastructure DI'sında kayıt et. `ReferenceRepository` (Platform) registry üzerinden dispatch eder.

## Adlandırma (Kısa)

| Öğe | Format | Örnek |
|---|---|---|
| Command | `<Action><Entity>Command` | `CreateAccountCommand`, `CreateSupplierCommand` |
| Query | `<Action><Entity>Query` | `ListAccountsQuery`, `GetSupplierQuery` |
| Handler | `<Action><Entity>Handler` | `CreateAccountHandler` |
| Validator | `<Action><Entity>Validator` | `CreateSupplierValidator` |
| Error sınıfı | `<Entity>Errors` (static) | `AccountErrors.NotFound`, `SupplierErrors.DuplicateVkn` |
| Error kodu | `<Entity>.<Reason>` | `"Account.NotFound"`, `"Supplier.DuplicateVkn"` |
| DTO | `<Entity>DetailItem / ListItem / ListFilter` | `SupplierDetailItem` |
| Controller | `<Entity>Controller` (singular) | `AccountController`, `SupplierController` |
| Route base | `api/<entity>` | `api/account`, `api/supplier` |
| Action route | kebab-case | `set-state`, `bulk-update-status` |
| Privilege code | `<Entity>.<Op>` | `"Account.Create"`, `"Supplier.Create"` |
| Resolver | `<Entity>ReferenceResolver` | `AccountReferenceResolver`, `SupplierReferenceResolver` |

## Claude İçin API Çalışma Talimatları

1. **App'i belirle.** Yeni feature/endpoint hangi uygulamaya ait? Crm/CodePro/Platform — Account → CRM, Supplier → CodePro, Activity → Platform.
2. Command/Query kararı ver. Aynı sınıf iki iş yapmaz.
3. `<App>.Application/Features/<Entity>/Commands|Queries/<Action>/` altına Command + Handler (+ Validator) dosyalarını ayrı yaz.
4. İş kuralı ihlali için `Result.Failure` kullan, exception atma. Error sınıfına yeni kod ekle.
5. Query'de uygun DbContext interface'i (`IApplicationDbContext` Platform-wide; `ICrmDbContext`/`ICodeProDbContext` app-spesifik), Command'da repository — karıştırma.
6. Mapping kodu el ile yazma. App'in `<App>MappingConfig`'ine kural ekle.
7. Controller'ı tek satır tut, `[PrivilegeAuthorize]` ekle. Privilege kodu app'in PrivilegeCodes sınıfında.
8. Yeni entity Activity regarding zincirine sokulacaksa: `<App>.Infrastructure/References/<Entity>ReferenceResolver.cs` yaz, `IEntityReferenceResolver` implement et, `<App>.Infrastructure.DependencyInjection`'da `AddScoped` ile kayıt et.
9. Değişikliğin hangi katmanı/app'i etkilediğini kısaca belirt. Örnek: *"Bu değişiklik `Apps/Crm/Crm.Application/Features/Accounts/Commands/CreateAccount/` altında; `Platform.Domain` etkilenmiyor."*

Belirsizlikte sor:
- Bu entity hangi app'in iş kavramı (Crm/CodePro/Platform)? Birden fazla app'te varsa Platform; tekse o app.
- Bu bir input validation mı yoksa business rule mi (validator mı, handler mı)?
- Yeni bir error code açalım mı, mevcut bir `<Entity>Errors` üyesi yeter mi?
- Bu command mevcut aggregate'i mi güncelliyor yoksa yenisini mi yazıyor?
- Hata `ErrorType` olarak Validation/NotFound/Conflict/Unauthorized/Failure hangisi?
- Yeni entity Activity regarding olarak çağrılacak mı? Çağrılacaksa `<Entity>ReferenceResolver` ekle.
