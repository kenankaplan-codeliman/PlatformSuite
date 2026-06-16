import { useEffect, useMemo, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  CurrencyField,
  DateTimeField,
  DetailPageLayout,
  EntityLookupField,
  FormRow,
  FormSection,
  NumberField,
  RelatedActivitiesTab,
  SelectField,
  ServicePath,
  TableField,
  TextAreaField,
  TextField,
  useGeneralParameters,
  useOwnerAssignAction,
  useRouteMode,
  useSetStateAction,
  type DetailPageAction,
  type DetailPageTab,
  type SelectOption,
  type TableFieldColumn,
} from "@platform/ui";
import { CrmServicePath } from "../../../../shared/api/servicePaths";
import { useOpportunityQuery } from "../../../../entities/opportunity/api/useOpportunityQueries";
import {
  useDeleteOpportunity,
  useUpsertOpportunity,
} from "../../../../entities/opportunity/api/useOpportunityMutations";
import { opportunitySchema } from "../../../../entities/opportunity/model/schema";
import type {
  OpportunityFormValues,
  OpportunityProductModal,
} from "../../../../entities/opportunity/model/types";
import { productDataSource } from "../../../../entities/product/api/productDataSource";
import { RoutePaths } from "../../../../app/router/paths";

// Yeni satır kalemi factory'si — `id: crypto.randomUUID()` ile yeni satırlar
// backend `CollectionSync.Merge` tarafından yeni kayıt olarak algılanır.
// Para birimi yok — parent opportunity.currency line item'ları için ortak.
// unitCode ürün seçilince Product.UnitOfMeasure'dan prefill edilir (aşağıdaki onRowChange).
const newProductLine = (): OpportunityProductModal => ({
  id: crypto.randomUUID(),
  product: null,
  quantity: 1,
  unitPrice: 0,
  unitCode: null,
  discountRate: 0,
  discountAmount: 0,
  lineTotal: 0,
  netAmount: 0,
});

const formatAmount = (n: number) =>
  n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Satır toplam (brüt) — Quantity × UnitPrice. Backend ile aynı formül.
const computeLineGross = (row: OpportunityProductModal | undefined): number =>
  Number(row?.quantity ?? 0) * Number(row?.unitPrice ?? 0);

// Satır toplam indirim — önce oran sonra tutar (backend OpportunityProduct ile birebir).
const computeLineDiscount = (
  row: OpportunityProductModal | undefined,
): number => {
  const gross = computeLineGross(row);
  const rate = Math.max(0, Math.min(100, Number(row?.discountRate ?? 0)));
  const amount = Math.max(0, Number(row?.discountAmount ?? 0));
  return (gross * rate) / 100 + amount;
};

// Net = max(0, brüt − toplam indirim) — backend NetAmount clamp'i ile aynı.
const computeLineNet = (row: OpportunityProductModal | undefined): number => {
  const net = computeLineGross(row) - computeLineDiscount(row);
  return net < 0 ? 0 : net;
};

const emptyOpportunity: OpportunityFormValues = {
  id: "",
  name: "",
  description: null,
  account: null,
  primaryContact: null,
  stage: "Prospecting",
  estimatedAmount: null,
  currency: null,
  actualAmount: null,
  actualNetAmount: null,
  totalDiscountAmount: null,
  totalDiscountRate: null,
  probability: 0,
  closeDate: null,
  lossReason: null,
  products: [],
  isActive: true,
};

/**
 * Satırdaki ürün değiştiğinde Product detayını çekip uygun alanları prefill eder:
 *  - `unitCode` ← Product.UnitOfMeasure (her zaman)
 *  - `unitPrice` ← Product.UnitPrice (yalnız Product.UnitPriceCurrency === opportunity.currency ise)
 *
 * Mevcut satırlar (load edilen DTO) için ilk render'da onRowChange tetiklenmez
 * (TableField diff prev=row); yalnızca kullanıcı yeni seçim yaptığında çalışır.
 */
async function applyProductPrefill(
  productId: string,
  opportunityCurrency: string | null | undefined,
  setRowValue: (field: "unitCode" | "unitPrice", value: unknown) => void,
) {
  try {
    const product = await productDataSource.get(productId);
    setRowValue("unitCode", product.unitOfMeasure ?? null);
    if (
      opportunityCurrency &&
      product.unitPriceCurrency &&
      product.unitPriceCurrency === opportunityCurrency &&
      product.unitPrice != null
    ) {
      setRowValue("unitPrice", product.unitPrice);
    }
  } catch {
    // Sessiz: prefill best-effort. Satır manuel doldurulabilir; backend yine de yazmayı kabul eder.
    void 0;
  }
}

interface OpportunityTotals {
  actualAmount: number | null;
  actualNetAmount: number | null;
  totalDiscountAmount: number | null;
  totalDiscountRate: number | null;
}

// Tüm fırsat seviyesindeki toplamları products'tan canlı hesaplar — backend
// `RecalculateTotals` ile birebir formül; satır yoksa hepsi null.
const computeOpportunityTotals = (
  products: OpportunityProductModal[] | undefined,
): OpportunityTotals => {
  if (!products || products.length === 0) {
    return {
      actualAmount: null,
      actualNetAmount: null,
      totalDiscountAmount: null,
      totalDiscountRate: null,
    };
  }
  let gross = 0;
  let discount = 0;
  let net = 0;
  for (const row of products) {
    gross += computeLineGross(row);
    discount += computeLineDiscount(row);
    net += computeLineNet(row);
  }
  // Backend ile aynı: 2 ondalıkta yuvarla.
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    actualAmount: round2(gross),
    actualNetAmount: round2(net),
    totalDiscountAmount: round2(discount),
    totalDiscountRate: gross > 0 ? round2((discount / gross) * 100) : null,
  };
};

export function OpportunityDetailPage() {
  const { mode, id } = useRouteMode();
  const { t: tPage } = useTranslation("page.opportunities-detail");
  const { t: tEntity } = useTranslation("entity.opportunity");
  const { t: tCommon } = useTranslation("common");

  const query = useOpportunityQuery(id);
  const upsert = useUpsertOpportunity();
  const deleteMutation = useDeleteOpportunity();

  // stage GeneralParameter'dan beslenir — statik enum yok.
  const { options: stageOptions } = useGeneralParameters("OpportunityStage");

  // Sahip atama + Aktif/Pasif: ayrı action endpoint'leri (save'e dahil değil),
  // kendi privilege'larıyla; başarıda footer + detail query tazelenir.
  const ownerAssign = useOwnerAssignAction({
    entityId: id,
    entityType: "Opportunity",
    servicePath: CrmServicePath.Opportunity.Assign,
  });
  const stateToggle = useSetStateAction({
    entityId: id,
    entityType: "Opportunity",
    servicePath: CrmServicePath.Opportunity.SetState,
    isActive: query.data?.isActive ?? true,
    onSuccess: () => {
      void query.refetch();
    },
  });
  const extraActions = [ownerAssign.action, stateToggle.action].filter(
    (a): a is DetailPageAction => a !== null,
  );

  // Her satır için son kabul ettiğimiz productId — `applyProductPrefill`'i dedupe
  // eder. İki tetikleyici var: (1) RHF setValue('products.N.unitCode'/'unitPrice')
  // sonrası useWatch parent row için yeni referans dönebiliyor; TableField diff
  // `Object.is(prev.product, row.product)` ile referans karşılaştırması yaptığı
  // için aynı id değerinde olsa bile 'product' değişti gibi görünüp ateşliyor →
  // sonsuz `/api/product/get` loop'u. (2) İlk veri yükleme: defaults({}) → loaded
  // row geçişi de diff'i ateşliyor; bu sefer snapshot'ı (sunucudan gelen
  // unitCode/unitPrice) ezmek istemiyoruz — query.data ile karşılaştırıp atla.
  // Ref parent scope'ta; `ProductsSection` iç-içe tanımlı olduğu için her parent
  // render'da remount olur ve içinde tutulacak useRef state'i kaybolur.
  const lastProductIdByRowRef = useRef<Map<number, string | null>>(new Map());

  // new/edit başlığı DetailPageLayout'ta entityType'tan generic üretilir;
  // burada yalnız view modunun kayıt adını sağlıyoruz.
  const title = useMemo(
    () => query.data?.name ?? tPage("viewTitle"),
    [query.data?.name, tPage],
  );

  const tabs: DetailPageTab[] | undefined =
    mode === "new" || !id
      ? undefined
      : [
          {
            key: "activities",
            label: tCommon("tabs.activities"),
            content: (
              <RelatedActivitiesTab entityType="Opportunity" entityId={id} />
            ),
          },
        ];

  return (
    <DetailPageLayout<OpportunityFormValues>
      mode={mode}
      title={title}
      schema={opportunitySchema}
      defaultValues={emptyOpportunity}
      data={query.data as OpportunityFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => {
        await upsert.mutateAsync(values);
      }}
      onDelete={
        id
          ? async () => {
              await deleteMutation.mutateAsync(id);
            }
          : undefined
      }
      afterSaveNavigation={(saved) => RoutePaths.OpportunityView(saved.id)}
      tabs={tabs}
      entityType="Opportunity"
      entityId={id}
      extraActions={extraActions}
    >
      {ownerAssign.modal}
      <GeneralSection stageOptions={stageOptions} />
      <FinancialSection />
      <ProductsSection />
      <DetailsSection />
    </DetailPageLayout>
  );

  function ProductsSection() {
    const form = useFormContext<OpportunityFormValues>();
    // Ölçü birimi (GeneralParameter: ProductUnitOfMeasure) — satır seviyesi SelectField.
    const { options: unitOptions } = useGeneralParameters(
      "ProductUnitOfMeasure",
    );

    // Satır toplamlarından ActualAmount + ActualNetAmount + TotalDiscount(Amount/Rate)
    // canlı hesapla → form'a yaz. useWatch add/remove + cell edit'i tek mekanizmayla
    // yakalar; backend save sırasında `RecalculateTotals` aynı formülü tekrar uygular,
    // bu nedenle client display vs. server kayıtlı değer arasında fark olmaz.
    const watchedProducts = useWatch({
      control: form.control,
      name: "products",
    }) as OpportunityProductModal[] | undefined;
    const totals = useMemo(
      () => computeOpportunityTotals(watchedProducts),
      [watchedProducts],
    );
    useEffect(() => {
      // Tüm dört alan da `number | null` — OpportunityFormValues içinde nullish şema.
      // `setValue`'nun jenerik conditional tipi `null`'u doğrudan kabul ettirmiyor; cast
      // OpportunityTotals[K] → unknown → never üzerinden.
      const syncIfChanged = (
        field:
          | "actualAmount"
          | "actualNetAmount"
          | "totalDiscountAmount"
          | "totalDiscountRate",
      ) => {
        const next = totals[field];
        if (form.getValues(field) !== next) {
          form.setValue(field, next as never, {
            shouldDirty: false,
            shouldValidate: false,
          });
        }
      };
      syncIfChanged("actualAmount");
      syncIfChanged("actualNetAmount");
      syncIfChanged("totalDiscountAmount");
      syncIfChanged("totalDiscountRate");
    }, [totals, form]);

    const columns: TableFieldColumn<
      OpportunityFormValues,
      OpportunityProductModal
    >[] = [
      {
        key: "product",
        header: tEntity("products.columns.product"),
        width: "1fr",
        render: ({ path }) => (
          <EntityLookupField
            name={path("product")}
            control={form.control}
            entityType="Product"
            required
          />
        ),
      },
      {
        key: "quantity",
        header: tEntity("products.columns.quantity"),
        width: "110px",
        render: ({ path }) => (
          <NumberField
            name={path("quantity")}
            control={form.control}
            min={0}
            precision={4}
            required
          />
        ),
      },
      {
        key: "unitCode",
        header: tEntity("products.columns.unitCode"),
        width: "140px",
        // Ürün seçimi ile snapshot olarak doldurulur (applyProductPrefill); kullanıcı
        // doğrudan değiştiremez — force="readonly" ile her modda salt-okunur (SelectField
        // <span>{label}</span> render eder, dropdown açılmaz). Yeni bir birim isteniyorsa
        // farklı bir ürün seçilir; backend yine setValue ile güncellediğimiz değeri kabul eder.
        render: ({ path }) => (
          <SelectField<OpportunityFormValues>
            name={path("unitCode")}
            control={form.control}
            options={unitOptions}
            force="readonly"
          />
        ),
      },
      {
        key: "unitPrice",
        header: tEntity("products.columns.unitPrice"),
        width: "140px",
        align: "right",
        render: ({ path }) => (
          <CurrencyField
            name={path("unitPrice")}
            control={form.control}
            min={0}
            precision={2}
          />
        ),
      },
      {
        key: "discountRate",
        header: tEntity("products.columns.discountRate"),
        width: "110px",
        align: "right",
        // 0-100 arası yüzde — backend InclusiveBetween(0,100) ile birebir.
        render: ({ path }) => (
          <NumberField
            name={path("discountRate")}
            control={form.control}
            min={0}
            max={100}
            precision={2}
          />
        ),
      },
      {
        key: "discountAmount",
        header: tEntity("products.columns.discountAmount"),
        width: "140px",
        align: "right",
        render: ({ path }) => (
          <CurrencyField
            name={path("discountAmount")}
            control={form.control}
            min={0}
            precision={2}
          />
        ),
      },
      {
        key: "lineTotal",
        header: tEntity("products.columns.lineTotal"),
        width: "140px",
        align: "right",
        compute: (row) => formatAmount(computeLineGross(row)),
      },
      {
        key: "netAmount",
        header: tEntity("products.columns.netAmount"),
        width: "140px",
        align: "right",
        // Backend `NetAmount` ile birebir: önce oran, sonra tutar; 0'da clamp.
        compute: (row) => formatAmount(computeLineNet(row)),
      },
    ];
    return (
      <FormSection title={tEntity("sections.products")}>
        <TableField<OpportunityFormValues, OpportunityProductModal>
          control={form.control}
          name="products"
          columns={columns}
          newRow={newProductLine}
          addLabel={tEntity("products.addLabel")}
          emptyLabel={tEntity("products.emptyLabel")}
          onRowChange={(rowIndex, field, value) => {
            // Ürün satırda değişince unitCode + (currency eşleşiyorsa) unitPrice prefill.
            // Dedupe + snapshot koruma için lastProductIdByRowRef üzerinden kontrol et;
            // yorumu için ref tanımına bak.
            if (field !== "product") return;
            const productId =
              (value as { id?: string } | null | undefined)?.id ?? null;
            const seen = lastProductIdByRowRef.current.get(rowIndex);
            // Aynı productId tekrar bildiriliyorsa (RHF referans yenilemesi vb.) hiç tetikleme.
            if (seen !== undefined && seen === productId) return;
            const isFirstSighting = seen === undefined;
            lastProductIdByRowRef.current.set(rowIndex, productId);
            if (isFirstSighting) {
              // İlk fire — sunucudan yüklenen satır mı yoksa kullanıcı seçimi mi
              // ayırt et. Yüklenen DTO ile aynı id ise snapshot'ı (unitCode/unitPrice)
              // koru; prefill atma.
              const loadedId =
                query.data?.products?.[rowIndex]?.product?.id ?? null;
              if (loadedId === productId) return;
            }
            if (!productId) return;
            const currency = form.getValues("currency");
            void applyProductPrefill(productId, currency, (key, v) => {
              form.setValue(
                `products.${rowIndex}.${key}` as
                  | "products.0.unitCode"
                  | "products.0.unitPrice",
                v as never,
                { shouldDirty: true, shouldValidate: false },
              );
            });
          }}
        />
      </FormSection>
    );
  }

  function GeneralSection({
    stageOptions,
  }: {
    stageOptions: SelectOption<string>[];
  }) {
    const form = useFormContext<OpportunityFormValues>();
    return (
      <FormSection title={tEntity("sections.general")}>
        <TextField
          name="name"
          control={form.control}
          label={tEntity("fields.name.label")}
          placeholder={tEntity("fields.name.placeholder")}
          required
          maxLength={250}
        />
        <FormRow columns={2}>
          <EntityLookupField
            name="account"
            control={form.control}
            servicePath={ServicePath.Account.Search}
            label={tEntity("fields.account.label")}
          />
          <EntityLookupField
            name="primaryContact"
            control={form.control}
            servicePath={ServicePath.Contact.Search}
            label={tEntity("fields.primaryContact.label")}
            allowClear
          />
        </FormRow>
        <FormRow columns={3}>
          <SelectField<OpportunityFormValues>
            name="stage"
            control={form.control}
            label={tEntity("fields.stage.label")}
            options={stageOptions}
            required
          />
          <NumberField
            name="probability"
            control={form.control}
            label={tEntity("fields.probability.label")}
            min={0}
            max={100}
            required
          />
          <DateTimeField
            name="closeDate"
            control={form.control}
            label={tEntity("fields.closeDate.label")}
          />
        </FormRow>
      </FormSection>
    );
  }

  function FinancialSection() {
    const form = useFormContext<OpportunityFormValues>();
    // Currency deal-level — tüm finansal alanlar (estimated/actual + tüm product satırları)
    // bu currency'dedir. Bu nedenle EstimatedAmount alanına gömülü değil, üst seviye
    // bağımsız bir dropdown olarak gösterilir.
    const { options: currencyOptions } = useGeneralParameters("CurrencyType");
    return (
      <FormSection title={tEntity("sections.financial")}>
        <SelectField<OpportunityFormValues>
          name="currency"
          control={form.control}
          label={tEntity("fields.currency.label")}
          options={currencyOptions}
          allowClear
        />
        <CurrencyField<OpportunityFormValues>
          name="estimatedAmount"
          control={form.control}
          label={tEntity("fields.estimatedAmount.label")}
          min={0}
          precision={2}
        />
        {/* ActualAmount Products satır toplamlarından (brüt) canlı hesaplanır; edit modda
            bile salt-okunur. Tüm line item'lar deal currency'de olduğu için toplam
            matematiksel olarak doğru. */}
        <CurrencyField<OpportunityFormValues>
          name="actualAmount"
          control={form.control}
          label={tEntity("fields.actualAmount.label")}
          precision={2}
          force="readonly"
        />
        {/* TotalDiscount — oran ve tutar cinsinden, ikisi de canlı hesaplanan readonly.
            Backend `RecalculateTotals` ile birebir formül; client display sadece UX için. */}
        <NumberField<OpportunityFormValues>
          name="totalDiscountRate"
          control={form.control}
          label={tEntity("fields.totalDiscountRate.label")}
          min={0}
          max={100}
          precision={2}
          force="readonly"
        />
        <CurrencyField<OpportunityFormValues>
          name="totalDiscountAmount"
          control={form.control}
          label={tEntity("fields.totalDiscountAmount.label")}
          precision={2}
          force="readonly"
        />
        <CurrencyField<OpportunityFormValues>
          name="actualNetAmount"
          control={form.control}
          label={tEntity("fields.actualNetAmount.label")}
          precision={2}
          force="readonly"
        />
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<OpportunityFormValues>();
    return (
      <FormSection title={tEntity("sections.details")}>
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity("fields.description.label")}
          rows={4}
        />
        <TextField
          name="lossReason"
          control={form.control}
          label={tEntity("fields.lossReason.label")}
          maxLength={500}
        />
      </FormSection>
    );
  }
}
