import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  CurrencyField,
  DetailPageLayout,
  FormRow,
  FormSection,
  RelatedActivitiesTab,
  SelectField,
  TextAreaField,
  TextField,
  useGeneralParameters,
  useRouteMode,
  useSetStateAction,
  type DetailPageAction,
  type DetailPageTab,
  type QuickCreateRenderProps,
  type SelectOption,
} from "@platform/ui";
import { CrmServicePath } from "../../../../shared/api/servicePaths";
import { useProductQuery } from "../../../../entities/product/api/useProductQueries";
import {
  useDeleteProduct,
  useUpsertProduct,
} from "../../../../entities/product/api/useProductMutations";
import { productSchema } from "../../../../entities/product/model/schema";
import type { ProductFormValues } from "../../../../entities/product/model/types";
import { RoutePaths } from "../../../../app/router/paths";

const emptyProduct: ProductFormValues = {
  id: "",
  name: "",
  productCode: "",
  category: null,
  unitPrice: null,
  unitPriceCurrency: null,
  unitOfMeasure: null,
  description: null,
  isActive: true,
};

export function ProductDetailPage({
  embedded,
}: {
  embedded?: QuickCreateRenderProps;
} = {}) {
  const route = useRouteMode();
  const mode = embedded ? "new" : route.mode;
  const id = embedded ? undefined : route.id;
  const { t: tPage } = useTranslation("page.products-detail");
  const { t: tEntity } = useTranslation("entity.product");
  const { t: tCommon } = useTranslation("common");

  const query = useProductQuery(id);
  const upsert = useUpsertProduct();
  const deleteMutation = useDeleteProduct();

  const { options: categoryOptions } = useGeneralParameters("ProductCategory");
  const { options: unitOptions } = useGeneralParameters("ProductUnitOfMeasure");

  const stateToggle = useSetStateAction({
    entityId: id,
    entityType: "Product",
    servicePath: CrmServicePath.Product.SetState,
    isActive: query.data?.isActive ?? true,
    onSuccess: () => {
      void query.refetch();
    },
  });
  const extraActions = [stateToggle.action].filter(
    (a): a is DetailPageAction => a !== null,
  );

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
              <RelatedActivitiesTab entityType="Product" entityId={id} />
            ),
          },
        ];

  return (
    <DetailPageLayout<ProductFormValues>
      mode={mode}
      title={title}
      schema={productSchema}
      defaultValues={
        embedded
          ? { ...emptyProduct, name: embedded.initialSearchText ?? "" }
          : emptyProduct
      }
      data={query.data as ProductFormValues | undefined}
      isLoading={query.isLoading}
      error={query.isError ? query.error : undefined}
      onSubmit={async (values) => (await upsert.mutateAsync(values)).id}
      onDelete={
        id
          ? async () => {
              await deleteMutation.mutateAsync(id);
            }
          : undefined
      }
      afterSaveNavigation={(saved) => RoutePaths.ProductView(saved.id)}
      tabs={tabs}
      entityType="Product"
      entityId={id}
      extraActions={extraActions}
      embedded={embedded}
      embeddedReferenceName={(saved) => saved.name}
    >
      <GeneralSection
        categoryOptions={categoryOptions}
        unitOptions={unitOptions}
      />
      <PricingSection />
      <DetailsSection />
    </DetailPageLayout>
  );

  function GeneralSection({
    categoryOptions,
    unitOptions,
  }: {
    categoryOptions: SelectOption<string>[];
    unitOptions: SelectOption<string>[];
  }) {
    const form = useFormContext<ProductFormValues>();
    return (
      <FormSection title={tEntity("sections.general")}>
        <FormRow columns={2}>
          <TextField
            name="name"
            control={form.control}
            label={tEntity("fields.name.label")}
            placeholder={tEntity("fields.name.placeholder")}
            required
            maxLength={250}
          />
          <TextField
            name="productCode"
            control={form.control}
            label={tEntity("fields.productCode.label")}
            placeholder={tEntity("fields.productCode.placeholder")}
            required
            maxLength={50}
          />
        </FormRow>
        <FormRow columns={2}>
          <SelectField<ProductFormValues>
            name="category"
            control={form.control}
            label={tEntity("fields.category.label")}
            options={categoryOptions}
            allowClear
          />
          <SelectField<ProductFormValues>
            name="unitOfMeasure"
            control={form.control}
            label={tEntity("fields.unitOfMeasure.label")}
            options={unitOptions}
            allowClear
          />
        </FormRow>
      </FormSection>
    );
  }

  function PricingSection() {
    const form = useFormContext<ProductFormValues>();
    const { options: currencyOptions } = useGeneralParameters("CurrencyType");
    return (
      <FormSection title={tEntity("sections.pricing")}>
        <FormRow columns={2}>
          <CurrencyField<ProductFormValues>
            name="unitPrice"
            control={form.control}
            label={tEntity("fields.unitPrice.label")}
            min={0}
            precision={2}
          />
          <SelectField<ProductFormValues>
            name="unitPriceCurrency"
            control={form.control}
            label={tEntity("fields.unitPriceCurrency.label")}
            options={currencyOptions}
            allowClear
          />
        </FormRow>
      </FormSection>
    );
  }

  function DetailsSection() {
    const form = useFormContext<ProductFormValues>();
    return (
      <FormSection title={tEntity("sections.details")}>
        <TextAreaField
          name="description"
          control={form.control}
          label={tEntity("fields.description.label")}
          rows={4}
        />
      </FormSection>
    );
  }
}
