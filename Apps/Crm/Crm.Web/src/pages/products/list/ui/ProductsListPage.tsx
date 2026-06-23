import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ListPageLayout,
  useReturnNavigate,
  useGeneralParameters,
  useUrlFilters,
  type DataTableColumn,
} from "@platform/ui";
import { useProductListQuery } from "../../../../entities/product/api/useProductQueries";
import type {
  ProductListFilter,
  ProductListItem,
} from "../../../../entities/product/model/types";
import {
  productListFilterDefaults,
  productListFilterSchema,
} from "../../../../entities/product/model/listFilterSchema";
import { RoutePaths } from "../../../../app/router/paths";
import { ProductsFilterPanel } from "./ProductsFilterPanel";

export function ProductsListPage() {
  const { t } = useTranslation("page.products-list");
  const { t: tEntity } = useTranslation("entity.product");
  const { getLabel: getCategoryLabel } =
    useGeneralParameters("ProductCategory");
  const { getLabel: getUnitOfMeasureLabel } = useGeneralParameters(
    "ProductUnitOfMeasure",
  );
  const { getLabel: getCurrencyLabel } = useGeneralParameters("CurrencyType");
  const navigate = useReturnNavigate();

  const { filters, setFilters, clearFilters } =
    useUrlFilters<ProductListFilter>({
      schema: productListFilterSchema,
      defaultValues: productListFilterDefaults,
    });

  const query = useProductListQuery({ filters });

  const data = useMemo<ProductListItem[]>(
    () => query.data?.pages.flatMap((p) => p.data) ?? [],
    [query.data],
  );

  const columns = useMemo<DataTableColumn<ProductListItem>[]>(
    () => [
      { key: "name", title: tEntity("fields.name.label"), dataIndex: "name" },
      {
        key: "productCode",
        title: tEntity("fields.productCode.label"),
        dataIndex: "productCode",
      },
      {
        key: "category",
        title: tEntity("fields.category.label"),
        render: (_v, r) => (r.category ? getCategoryLabel(r.category) : ""),
      },
      {
        key: "unitOfMeasure",
        title: tEntity("fields.unitOfMeasure.label"),
        render: (_v, r) =>
          r.unitOfMeasure ? getUnitOfMeasureLabel(r.unitOfMeasure) : "",
        width: 150,
      },
      {
        key: "unitPrice",
        title: tEntity("fields.unitPrice.label"),
        dataIndex: "unitPrice",
        align: "right",
        width: 150,
      },
      {
        key: "unitPriceCurrency",
        title: tEntity("fields.unitPriceCurrency.label"),
        render: (_v, r) =>
          r.unitPriceCurrency ? getCurrencyLabel(r.unitPriceCurrency) : "",
        width: 150,
      },
    ],
    [tEntity, getCategoryLabel, getUnitOfMeasureLabel, getCurrencyLabel],
  );

  return (
    <ListPageLayout<ProductListItem>
      title={t("title")}
      entityType="Product"
      columns={columns}
      data={data}
      rowKey="id"
      filterBar={
        <ProductsFilterPanel
          values={filters}
          onApply={setFilters}
          onClear={clearFilters}
        />
      }
      isLoading={query.isLoading}
      isFetchingMore={query.isFetchingNextPage}
      hasMore={query.hasNextPage}
      onLoadMore={() => query.fetchNextPage()}
      error={query.isError ? query.error : undefined}
      onCreateClick={() => navigate(RoutePaths.ProductNew)}
      createLabel={t("createButton")}
      onRowClick={(record) => navigate(RoutePaths.ProductView(record.id))}
    />
  );
}
