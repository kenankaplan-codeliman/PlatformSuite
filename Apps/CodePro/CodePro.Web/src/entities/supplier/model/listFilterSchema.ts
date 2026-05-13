import { z } from 'zod';
import type { SupplierListFilter } from './types';

/**
 * Supplier listesi filtre alanlarının sabit array'leri — `enumToOptions` için.
 * Detail form schema'sındaki enum'larla aynı tutulmalı.
 */
export const SUPPLIER_TYPES = [
  'Manufacturer',
  'Distributor',
  'ServiceProvider',
  'Retailer',
  'Other',
] as const;

export const SUPPLIER_STATUSES = ['Pending', 'Active', 'Passive', 'Blacklisted'] as const;

export const COMPANY_TYPES = ['Gercek', 'Tuzel'] as const;

/**
 * URL query param'larından gelen string'leri `SupplierListFilter`'a koerce eder.
 * Boş/eksik alanlar `undefined` döner — backend handler null-safe.
 */
export const supplierListFilterSchema: z.ZodType<SupplierListFilter> = z.object({
  search: z.string().optional(),
  supplierType: z.enum(SUPPLIER_TYPES).optional(),
  supplierStatus: z.enum(SUPPLIER_STATUSES).optional(),
  companyType: z.enum(COMPANY_TYPES).optional(),
  isActive: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === 'true')),
}) as z.ZodType<SupplierListFilter>;

export const supplierListFilterDefaults: SupplierListFilter = {};
