# Proje: CRM Uygulaması

**Mimari (Frontend):** MVI + Feature-Sliced Design — tam doküman: `docs/Client_Architecture.md`
**Mimari (API):** Clean Architecture + MediatR/CQRS + Result<T> — tam doküman: `docs/Api_Architecture.md`

Yeni bir sayfa, feature, entity, endpoint veya component önermeden önce ilgili dokümanın bölümünü oku.

---

## Teknoloji Stack

- React + TypeScript (strict mode)
- TanStack Query (server state)
- react-hook-form + zod (form + validation)
- Zustand + useReducer (client state)
- TanStack Router / React Router
- Axios (yalnızca `shared/api/httpClient` üzerinden)

---

## Katman Yapısı ve Bağımlılık Yönü

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

### Yasaklar

- `entities/account` → `entities/order` importu **yasak**
- `features/*` → başka bir `features/*` importu **yasak** (kardeştirler)
- Doğrudan `axios` kullanımı **yasak** — sadece `shared/api/httpClient`
- Reducer içinde yan etki **yasak**
- Field primitifi dışında `mode === 'view'` kontrolü **yasak**
- Mode prop olarak geçirmek **yasak** (context kullan)
- Jenerik `<EntityDetailPage entity="x" />` **yasak**

---

## Component Konumlandırma Kuralı

| Parça nasıl? | Konum |
|---|---|
| Domain bilmiyor, generic (Button, TextField) | `shared/ui/` |
| Tek entity'ye ait basit görsel (Avatar, Badge) | `entities/<x>/ui/` |
| Kullanıcı niyeti temsil ediyor (form, dialog) | `features/<entity>-<eylem>/ui/` |
| Birden fazla sayfada kullanılan kompozisyon | `widgets/<ad>/ui/` |
| Sadece tek sayfada kullanılıyor | `pages/<sayfa>/ui/` |

**Altın kural:** İkinci sayfada kullanılana kadar `pages/` dışına taşıma. Erken soyutlama yapma.

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

Mode **URL'den** çıkarılır, state'te tutulmaz. `shared/hooks/useRouteMode.ts` kullanılır.

### DetailPageLayout Kullanımı

Tüm Detail sayfaları `shared/ui/detail-page/DetailPageLayout` kullanır. Layout şunları üstlenir:
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
      title={(mode, data) => mode === 'new' ? 'Yeni Firma' : data?.name ?? 'Firma'}
      afterSaveNavigation="view"
    >
      <FormSection title="Genel Bilgiler">
        <TextField name="name" label="Firma Adı" required />
        <TextField name="accountNumber" label="Firma No" force="readonly" />
      </FormSection>
    </DetailPageLayout>
  );
}
```

---

## List Page Pattern

Tüm liste sayfaları `shared/ui/list-page/ListPageLayout` kullanır. Layout: filtre bar, DataTable, "Yeni Ekle", URL-senkronize filtre/sayfalama, satır → detail navigasyonu.

Entity-spesifik filtreler ve kolonlar `widgets/<entity>-list/` altında yaşar.

---

## Form Mode Pattern — KRİTİK

### FormModeProvider

Mode + field permissions + dirty state'i context ile yayar. Tüm field'lar `useFormMode()` ile okur.

### Mode-Aware Field Primitifleri

`shared/ui/form/fields/` altında: `TextField`, `NumberField`, `SelectField`, `DateField`, `TextAreaField`, `CheckboxField`, `CurrencyField`, `LookupField`.

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
// entities/account/model/permissions.ts
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

HTTP çağrıları **yalnızca** `entities/<x>/api/` içinde. DTO → domain mapping `mappers.ts`'te.

### Query Keys — Merkezi Fabrika

```ts
// shared/api/queryKeys.ts
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters) => [...accountKeys.lists(), filters] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id) => [...accountKeys.details(), id] as const,
  activities: (id) => [...accountKeys.detail(id), 'activities'] as const,
};
```

### Cache Invalidation

- Create/Update/Delete → ilgili entity'nin `lists()` ve `detail(id)`
- Çapraz etkiler → `onSuccess` içinde açıkça
- Default staleTime: 30sn; referans veriler: 5dk

---

## Domain Kuralları

### Account
Aggregate root. Order/Activity'yi tanımaz.

### Order + OrderDetail
Order aggregate root, OrderDetail child'dır.
- OrderDetail için ayrı entity açma
- `entities/order/model/types.ts` içinde birlikte tanımlı
- CRUD: `features/order-line-editor/`
- Order view modda → OrderLineEditor da otomatik readonly (nested context)

### Activity
Tek entity, discriminated union (`phoneCall | task | appointment`).
- Type guard'lar: `entities/activity/model/guards.ts`
- Türe özel formlar: `features/activity-create/ui/forms/`
- Aynı reducer + aynı mutation

---

## Authentication

Login Detail Page Pattern kullanmaz (mode kavramı yok, tam ekran layout).

```
features/auth-login/
├── model/     # SUBMIT_CREDENTIALS, SUBMIT_SUCCESS, SUBMIT_FAILURE
├── api/useLoginMutation.ts
└── ui/LoginForm.tsx

pages/auth/login/ui/
├── LoginPage.tsx
└── LoginPageLayout.tsx    # tam ekran, SADECE bu sayfaya özel

app/router/guards/AuthGuard.tsx   # tüm korumalı rotaları sarar
```

Diğer auth feature'ları: `auth-logout`, `auth-forgot-password`, `auth-change-password`.

---

## Feature Şablonu

```
features/<entity>-<eylem>/
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

```
entities/<entity>/
├── model/
│   ├── types.ts           # TypeScript tipleri
│   ├── schema.ts          # zod şemaları
│   ├── guards.ts          # (polimorfik ise)
│   ├── calculations.ts    # (gerekirse)
│   ├── permissions.ts     # useXFieldPermissions
│   └── mappers.ts         # DTO ↔ domain
├── api/
│   ├── <entity>DataSource.ts
│   └── <entity>Queries.ts
└── ui/
    ├── <Entity>Avatar.tsx
    ├── <Entity>Badge.tsx
    └── <Entity>Lookup.tsx
```

**Yeni entity açmadan önce sor:** Kendi endpoint'i var mı? Kendi yaşam döngüsü var mı? Aggregate root mü? Değilse child entity olarak parent içinde yaşasın (OrderDetail gibi).

---

## Page Şablonu

### Detail Page

```
pages/<entity>/detail/
├── ui/<Entity>DetailPage.tsx      # DetailPageLayout + form alanları (20-40 satır)
└── sections/
    ├── <Entity>InfoSection.tsx    # SADECE bu sayfaya özel büyük bölümler
    └── <Entity>OtherSection.tsx
```

### List Page

```
pages/<entity>/list/
└── ui/<Entities>ListPage.tsx      # ListPageLayout
```

---

## Adlandırma

| Öğe | Format | Örnek |
|---|---|---|
| Entity klasörü | tekil, küçük harf | `account`, `order` |
| Feature klasörü | `<entity>-<eylem>` | `account-delete`, `order-line-editor` |
| Component | PascalCase | `AccountDetailPage.tsx` |
| Hook | camelCase + `use` | `useAccountQuery.ts` |
| Intent | UPPER_SNAKE_CASE | `ADD_LINE` |
| Query key | hiyerarşik tuple | `['accounts', 'detail', id]` |
| Page | `<Entity><Page>Page` | `AccountDetailPage`, `AccountsListPage` |
| Section | `<Entity><Ad>Section` | `OrderLinesSection` |

---

## Referans Örnekler (Bu stilde yaz)

Claude bu yollara bakarak yeni kodları aynı stilde üretir. İlk entity/feature yazıldıkça güncelle:

- **Entity:** `src/entities/account/`
- **Feature:** `src/features/order-line-editor/`
- **Widget:** `src/widgets/activity-timeline/`
- **Detail Page:** `src/pages/accounts/detail/ui/AccountDetailPage.tsx`
- **List Page:** `src/pages/accounts/list/ui/AccountsListPage.tsx`
- **DataSource:** `src/entities/account/api/accountDataSource.ts`
- **Reducer:** `src/features/order-line-editor/model/reducer.ts`
- **Permissions:** `src/entities/account/model/permissions.ts`
- **Field primitifi:** `src/shared/ui/form/fields/TextField.tsx`
- **Layout:** `src/shared/ui/detail-page/DetailPageLayout.tsx`

---

## Kaçınılması Gerekenler

- **God component:** 300+ satırlık sayfa → section/feature çıkar
- **Prop drilling:** 3+ seviye → context veya composition
- **Circular import:** ortak parçayı üst katmana taşı
- **Reducer'da yan etki:** API çağrısı, `Date.now()`, navigasyon → dışarı al
- **Erken genelleme:** ikinci kullanım gelene kadar bekle
- **Ayrı entity açma:** child entity/value object için (OrderDetail)
- **Jenerik Detail sayfası:** `<EntityDetailPage entity="x" />` yasak
- **Field dışında `mode === 'view'` kontrolü:** sadece field primitiflerinde
- **Mode'u state'te tutma:** URL tek kaynak
- **Mode prop'u:** context üzerinden yayılır

---

## Claude İçin Çalışma Talimatları

Kod yazarken veya önerirken:

1. **Önce konumu belirle.** "Component Konumlandırma Kuralı" tablosunu kullan.
2. **Bağımlılık yönünü kontrol et.** İmport ettiğin modül bu katmandan erişilebilir mi?
3. **Detail Page için `DetailPageLayout` kullan.** Sıfırdan form container yazma.
4. **Field seçimi:** Önce `shared/ui/form/fields/` altında mevcut field'lardan seç. Override gerekirse prop ekle. Yeni field türü son çare.
5. **Mode kararları:**
   - Varsayılan mode → `FormModeProvider` yayar
   - Tüm form readonly olmalı → `modeOverride` (sayfa seviyesinde)
   - Bir bölüm readonly → nested `FormModeProvider`
   - Tek alan farklı → field override prop'u
   - Dinamik (başka alana bağlı) → `useWatch` + sayfada koşul
6. **Şablonu uygula.** Yeni feature/entity için şablonu birebir takip et.
7. **Referans örneklere bak.** Mevcut entity/feature'ı oku, aynı stilde yaz.
8. **MVI'yı bozma.** Yan etki reducer dışında.
9. **Query key fabrikasını güncelle.** İnline key yazma.
10. **URL-first.** Mode URL'den, filtreler URL'den, sayfalama URL'den. State'te tutma.

Kod önerilerinde değişikliğin hangi katmanı etkilediğini kısaca belirt. Örnek: *"Bu değişiklik `features/order-line-editor/` içinde; `entities/order/` etkilenmiyor."*

Belirsizlikte sor:
- Yeni entity mi, yoksa mevcut aggregate'in parçası mı?
- Bu component widget mi, yoksa sayfaya mı özel?
- Override'ı hangi seviyede çözmeli?

---

# API Mimarisi (Platform.Api / Platform.Application / Platform.Domain / Platform.Infrastructure)

**Tam doküman:** `docs/Api_Architecture.md` — yeni bir endpoint, command, query, validator veya handler önermeden önce ilgili bölümü oku.

## Teknoloji Stack

- .NET 10 + ASP.NET Core
- EF Core 10 + PostgreSQL (Npgsql)
- **MediatR** — CQRS request/response + pipeline behaviors
- **FluentValidation** — input validation
- **Mapster** — entity ↔ DTO mapping
- **Serilog** + Elasticsearch, JWT + custom `PrivilegeAuthorize`

## Katman Yapısı ve Bağımlılık Yönü

```
Platform.Api → Platform.Application → Platform.Domain ← Platform.Infrastructure
```

| Katman | İmport edebildiği |
|---|---|
| `Platform.Api` | Application, Domain |
| `Platform.Application` | Domain |
| `Platform.Domain` | — (hiçbir proje) |
| `Platform.Infrastructure` | Application, Domain |

### Yasaklar

- `Platform.Api` → `Platform.Infrastructure` importu **yasak** (DbContext dahil). Sadece DI kompozisyon kökünde bağlanır.
- `Platform.Application` → `Platform.Infrastructure` tip importu **yasak**. Application interface tanımlar, Infrastructure implement eder (`IApplicationDbContext`, `IUnitOfWork`, `I<Entity>Repository`).
- `Platform.Domain` → başka hiçbir proje ve NuGet bağımlılığı yok.
- Controller'da `DbContext` / repository / handler inject etmek **yasak**. Her şey `ISender.Send(...)` üzerinden.
- Handler'da `throw new BusinessException(...)` **yasak**. İş kuralı ihlali `Result.Failure(<Entity>Errors.<Reason>)` ile.
- Query handler'da repository kullanmak **yasak**. Read path `IApplicationDbContext` + `.ProjectToType<T>()`.
- Manuel mapping (`entity.ToDto()` elle yazılmış) **yasak**. Mapster + `MappingConfig` kullan.
- Controller'da iş mantığı, `if` dalları, exception yakalama **yasak**. Controller method'u tek satır.

## Feature Şablonu

```
Platform.Application/Features/<Entity>/
├── Commands/<Action>/        # <Action>Command.cs + Handler.cs + Validator.cs
├── Queries/<Action>/          # <Action>Query.cs + Handler.cs
├── Dtos/                      # <Entity>DetailItem, ListItem, ListFilters
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
4. **Query path = `IApplicationDbContext` + projection.** Handler `_ctx.Accounts.Where(...).ProjectToType<AccountListItem>().ToListAsync()`. Repository query'de yok.
5. **Command path = repository + UnitOfWork.** `SaveChangesAsync` / `CommitTransaction` çağırma — `TransactionBehavior` sarar. `ICommand` marker'ı transaction tetikler.
6. **Mapping sadece Mapster.** `cmd.Adapt<Entity>()`, `entity.Adapt<DetailItem>()`, `.ProjectToType<T>()`. `MappingConfig.cs` tek noktada yapılandırılır.
7. **Controller tek satır.** `(await _sender.Send(request, ct)).ToActionResult()`. `ISender`'dan başka dependency inject edilmez.
8. **Tüm endpoint POST.** Route lowercase kebab-case: `api/<entity>/<action>` (örn: `api/account/set-state`). Method adı `<Action>Async` (ListAsync, CreateAsync).
9. **Error response = RFC 7807 ProblemDetails.** `Result.Failure` → `ErrorType`'a göre 400/404/409/403/500. Validation için `ValidationProblemDetails`. Custom envelope yazma.
10. **Privilege koruması zorunlu.** Her controller method'unda `[PrivilegeAuthorize(PrivilegeCodes.<Entity>PrivilegeCodes.<Op>)]`. Yeni privilege `Platform.Domain/Authorization/PrivilegeCodes.cs` içinde tanımlanır.

## Adlandırma (Kısa)

| Öğe | Format | Örnek |
|---|---|---|
| Command | `<Action><Entity>Command` | `CreateAccountCommand` |
| Query | `<Action><Entity>Query` | `ListAccountsQuery` |
| Handler | `<Action><Entity>Handler` | `CreateAccountHandler` |
| Validator | `<Action><Entity>Validator` | `CreateAccountValidator` |
| Error sınıfı | `<Entity>Errors` (static) | `AccountErrors.DuplicateName` |
| Error kodu | `<Entity>.<Reason>` | `"Account.DuplicateName"` |
| DTO | `<Entity>DetailItem / ListItem / ListFilters` | `AccountDetailItem` |
| Controller | `<Entity>Controller` (singular) | `AccountController` |
| Route base | `api/<entity>` | `api/account` |
| Action route | kebab-case | `set-state`, `bulk-update-status` |
| Privilege code | `<Entity>.<Op>` | `"Account.Create"` |

## Claude İçin API Çalışma Talimatları

1. Önce Command/Query kararı ver. Aynı sınıf iki iş yapmaz.
2. `Features/<Entity>/Commands|Queries/<Action>/` altına Command + Handler (+ Validator) dosyalarını ayrı yaz.
3. İş kuralı ihlali için `Result.Failure` kullan, exception atma. Error sınıfına yeni kod ekle.
4. Query'de `IApplicationDbContext`, Command'da repository — karıştırma.
5. Mapping kodu el ile yazma. Mapster config'ine kural ekle.
6. Controller'ı tek satır tut, `[PrivilegeAuthorize]` ekle.
7. Değişikliğin hangi katmanı etkilediğini kısaca belirt. Örnek: *"Bu değişiklik `Features/Accounts/Commands/CreateAccount/` altında; `Platform.Domain` etkilenmiyor."*

Belirsizlikte sor:
- Bu bir input validation mı yoksa business rule mi (validator mı, handler mı)?
- Yeni bir error code açalım mı, mevcut bir `<Entity>Errors` üyesi yeter mi?
- Bu command mevcut aggregate'i mi güncelliyor yoksa yenisini mi yazıyor?
- Hata `ErrorType` olarak Validation/NotFound/Conflict/Unauthorized/Failure hangisi?
